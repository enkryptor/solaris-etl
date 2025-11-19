import * as fs from "fs";
import * as path from "path";
import { parse } from "@fast-csv/parse";
import { xxh32 } from "@node-rs/xxhash";

import { HistoryRow } from "../interfaces";
import { AppDataSource } from "../data-source";
import { OceanObjectState } from "../entity/ObjectState";
import { OceanReading } from "../entity/Reading";
import { OceanObjectGeometry } from "../entity/Geometry";
import { OceanObjectPCDataHash } from "../entity/PCDataHash";
import { OceanObjectPCData } from "../entity/PCData";
import { OceanObject } from "../entity/Object";

const BATCH_SIZE = 10;

function parseParams(params: string[]): { filename: string } {
  if (params.length !== 1) {
    throw new Error("CSV file name required");
  }
  const filename = params[0];
  return { filename };
}

/**
 * Import CSV file
 */
export default async function importCSV(params: string[]): Promise<void> {
  const { filename } = parseParams(params);
  const filepath = path.resolve(filename);
  const timestamp = fs.statSync(filepath).atime;

  await AppDataSource.initialize();

  const reading = new OceanReading();
  reading.timestamp = timestamp;
  await AppDataSource.manager.save(reading);

  let hasData = true;
  let skip = 0;
  while (hasData) {
    const batch = await readBatch(filepath, BATCH_SIZE, skip);
    await saveBatch(batch, reading);
    hasData = batch.length === BATCH_SIZE;
    skip += BATCH_SIZE;
  }

  await AppDataSource.destroy();
}

function parseRow(row: Record<string, string>): HistoryRow {
  const history: HistoryRow = {
    code: row["code"],
    lat: Number.parseFloat(row["lat"]),
    lon: Number.parseFloat(row["lon"]),
    radius: Number.parseFloat(row["radius"]),
    data: row["data"],
  };
  console.log(`Extracted ${history.code}`);
  return history;
}

function readBatch(
  filepath: string,
  batchSize: number,
  skip = 0
): Promise<HistoryRow[]> {
  return new Promise((resolve, reject) => {
    const buffer = [];
    fs.createReadStream(filepath)
      .pipe(
        parse({
          headers: true,
          strictColumnHandling: true,
          maxRows: batchSize,
          skipRows: skip,
        })
      )
      .on("error", reject)
      .on("data", (row) => {
        const user = parseRow(row);
        buffer.push(user);
      })
      .on("end", (rowCount: number) => {
        resolve(buffer);
      });
  });
}

async function saveBatch(
  history: HistoryRow[],
  reading: OceanReading
): Promise<void> {
  for (const row of history) {
    const geometry = new OceanObjectGeometry();
    geometry.lat = 0;
    geometry.lon = 0;
    geometry.radius = 0;
    await AppDataSource.manager.save(geometry);

    const rowData = Buffer.from(row.data, "base64");
    const rowHash = xxh32(rowData);

    let hash = await AppDataSource.manager.findOne(OceanObjectPCDataHash, {
      where: { hash: rowHash },
    });

    if (!hash) {
      const data = new OceanObjectPCData();
      data.data = rowData;
      await AppDataSource.manager.save(data);

      hash = new OceanObjectPCDataHash();
      hash.hash = rowHash;
      hash.data = data;
      await AppDataSource.manager.save(hash);
    }

    let obj = await AppDataSource.manager.findOne(OceanObject, {
      where: { code: row.code },
    });
    if (!obj) {
      obj = new OceanObject();
      obj.code = row.code;
      await AppDataSource.manager.save(obj);
    }

    const state = new OceanObjectState();
    state.reading = reading;
    state.object = obj;
    state.geometry = geometry;
    state.hash = hash;
    await AppDataSource.manager.save(state);
    console.log(`Loaded ${state.object.code} as ${state.id}`);
  }
}
