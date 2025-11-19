import * as fs from "fs";
import * as path from "path";

import { ReaderCSV } from "../lib/readers";
import { WriterSQL } from "../lib/writers";

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
export default async function importCSV(params: string[]): Promise<void> {
  const { filename } = parseParams(params);
  const filepath = path.resolve(filename);
  const timestamp = fs.statSync(filepath).atime;
  const reader = new ReaderCSV(filepath);
  const writer = new WriterSQL();

  await writer.start(timestamp);
  let count = 0;
  for await (const record of reader.read()) {
    await writer.write(record);
    count++;
  }
  writer.end();
  console.log(`Successfully imported ${count} entites`);
}
