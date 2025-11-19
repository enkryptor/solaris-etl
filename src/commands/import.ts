import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { xxh32 } from "@node-rs/xxhash";

import { HistoryRecord } from "../interfaces";
import { AppDataSource } from "../data-source";
import { OceanObjectState } from "../entity/ObjectState";
import { OceanReading } from "../entity/Reading";
import { OceanObjectGeometry } from "../entity/Geometry";
import { OceanObjectPCDataHash } from "../entity/PCDataHash";
import { OceanObjectPCData } from "../entity/PCData";
import { OceanObject } from "../entity/Object";

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

  const parser = fs.createReadStream(filepath).pipe(parse({ columns: true }));
  for await (const row of parser) {
    const record = parseRow(row);
    console.log(`Extracted ${record.code}`);
    const saved = await save(record, reading);
    console.log(`Loaded ${saved.object.code} as ${saved.id}`);
  }

  await AppDataSource.destroy();
}

function parseRow(row: Record<string, string>): HistoryRecord {
  return {
    code: row["code"],
    lat: Number.parseFloat(row["lan"]),
    lon: Number.parseFloat(row["lon"]),
    radius: Number.parseFloat(row["radius"]),
    data: row["data"],
  };
}

async function save(
  record: HistoryRecord,
  reading: OceanReading
): Promise<OceanObjectState> {
  const geometry = new OceanObjectGeometry();
  geometry.lat = record.lat;
  geometry.lon = record.lon;
  geometry.radius = record.radius;
  await AppDataSource.manager.save(geometry);

  const rowData = Buffer.from(record.data, "base64");
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
    where: { code: record.code },
  });
  if (!obj) {
    obj = new OceanObject();
    obj.code = record.code;
    await AppDataSource.manager.save(obj);
  }

  const state = new OceanObjectState();
  state.reading = reading;
  state.object = obj;
  state.geometry = geometry;
  state.hash = hash;
  return await AppDataSource.manager.save(state);
}
