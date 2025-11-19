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
 * Читалка CSV-файлов
 */
export class ReaderCSV {
    constructor(private filepath: string) {}

    /**
     * Прочитать записи построчно
     */
    public async * read() {
        const parser = fs.createReadStream(this.filepath).pipe(parse({ columns: true }));
        for await (const row of parser) {
            yield parseRow(row);
        }
    }
}
