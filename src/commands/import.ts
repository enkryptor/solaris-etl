import * as fs from "fs";
import * as path from "path";

import { readCSV } from "../lib/readers";
import { HistoryRecord, Writer } from "../interfaces";


/**
 * Обработать параметры команды импорта.
 * В текущей версии команда ожидает только имя файла.
 */
function parseParams(params: string[]): { filename: string } {
  if (params.length !== 1) {
    throw new Error("CSV file name required");
  }
  const filename = params[0];
  return { filename };
}

/**
 * Загрузить данные из CSV-файла
 */
export default async function importCSV(params: string[], writer: Writer<Date, HistoryRecord>): Promise<void> {
  const { filename } = parseParams(params);
  const filepath = path.resolve(filename);
  const timestamp = fs.statSync(filepath).atime;

  const startTime = process.hrtime();
  await writer.start(timestamp);
  let count = 0;
  for await (const record of readCSV(filepath)) {
    await writer.write(record);
    count++;
  }
  writer.end();

  const elapsed = process.hrtime(startTime)[1] / 1000000;
  console.log(`Successfully imported ${count} entites for ${elapsed.toFixed(2)} ms`);
}
