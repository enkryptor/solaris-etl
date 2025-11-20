import * as fs from "fs";
import { parse } from "csv-parse";

import { HistoryRecord } from "../../interfaces";

/**
 * Логика преобразования CSV-строки в объект исторических данных
 */
function parseRow(row: Record<string, string>): HistoryRecord {
  return {
    code: row["code"],
    lat: Number.parseFloat(row["lan"]),
    lon: Number.parseFloat(row["lon"]),
    radius: Number.parseFloat(row["radius"]),
    data: row["data"],
  };
}

/**
 * Прочитать записи из CSV-файла
 */
export async function * readCSV(filepath: string): AsyncGenerator<HistoryRecord, void, void> {
  const parser = fs.createReadStream(filepath).pipe(parse({ columns: true }));
  for await (const row of parser) {
    yield parseRow(row);
  }
}
