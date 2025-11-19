import * as fs from "fs";
import * as path from "path";
import { parse } from "@fast-csv/parse";

import { HistoryRow } from "../interfaces";

import { AppDataSource } from "../data-source";
import { OceanObjectState } from "../entity/Object";

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
  await AppDataSource.initialize();

  let hasData = true;
  let skip = 0;
  while (hasData) {
    const batch = await readBatch(path.resolve(filename), BATCH_SIZE, skip);
    await saveBatch(batch);
    hasData = batch.length === BATCH_SIZE;
    skip += BATCH_SIZE;
  }

  await AppDataSource.destroy();
}

function parseRow(row: Record<string, string>): HistoryRow {
  const history: HistoryRow = {
    code: row['code'],
    lat: Number.parseFloat(row['lat']),
    lon: Number.parseFloat(row['lon']),
    radius: Number.parseFloat(row['radius']),
    data: row['data'],
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

async function saveBatch(history: HistoryRow[]) {
  const entities = history.map((user) => {
    const state = new OceanObjectState();
    return state;
  });
  const savedEntities = await AppDataSource.manager.save(entities);
  for (const entity of savedEntities) {
    console.log(
      `Loaded ${entity.object.code} as ${entity.id}`
    );
  }
}
