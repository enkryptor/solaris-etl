import { xxh32 } from "@node-rs/xxhash";
import { HistoryRecord, Writer } from "../../interfaces";
import { dataSourceFactory } from "./data-source";
import { OceanReading } from "./entity/Reading";

/**
 * "Наивный" записыватель исторических данных в PostgreSQL.
 * 
 * Пишет сущности по одной, создавая зависимости отдельными запросами.
 */
export abstract class BaseWriter implements Writer<Date, HistoryRecord> {
  protected reading?: OceanReading;
  protected dataSource = dataSourceFactory();

  /**
   * Начать сессию записи исторических данных
   */
  public async start(timestamp: Date): Promise<void> {
    if (this.reading) {
      throw new Error("The writing session is already started");
    }

    await this.dataSource.initialize();
    const reading = new OceanReading();
    reading.timestamp = timestamp;
    await this.dataSource.manager.save(reading);
    this.reading = reading;
  }

  /**
   * Записать исторические данные
   */
  public async write(record: HistoryRecord): Promise<void> {
    if (!this.reading) {
      throw new Error("The writing session was not started");
    }

    throw new Error("Method not implemented.");
  }

  /**
   * Закончить сессию записи исторических данных
   */
  public async end(): Promise<void>  {
    await this.dataSource.destroy();
    this.reading = void 0;
  }

  /**
   * Посчитать хэш буфера
   */
  protected getBufferHash(buffer: Buffer<ArrayBuffer>): number {
    // Смена стратегии записи должна быть совместима с предыдущими значениями в БД,
    // поэтому вид хэша должен остаться прежним — выносим реализацию в базовый класс.
    return xxh32(buffer);
  }
}
