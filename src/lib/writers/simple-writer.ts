import { xxh32 } from "@node-rs/xxhash";
import { HistoryRecord, Writer } from "../../interfaces";
import { dataSourceFactory } from "./data-source";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanReading } from "./entity/Reading";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObject } from "./entity/Object";
import { OceanObjectState } from "./entity/ObjectState";

/**
 * "Наивный" записыватель исторических данных в PostgreSQL.
 * 
 * Пишет сущности по одной, создавая зависимости отдельными запросами.
 */
export class SimpleWriter implements Writer<Date, HistoryRecord> {
  private reading?: OceanReading;
  private dataSource = dataSourceFactory();

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

    const geometry = new OceanObjectGeometry();
    geometry.lat = record.lat;
    geometry.lon = record.lon;
    geometry.radius = record.radius;
    await this.dataSource.manager.save(geometry);

    const rowData = Buffer.from(record.data, "base64");
    const rowHash = xxh32(rowData);

    let data = await this.dataSource.manager.findOne(OceanObjectPCData, {
      where: { hash: rowHash },
    });

    if (!data) {
      const data = new OceanObjectPCData();
      data.data = rowData;
      data.hash = rowHash;
      await this.dataSource.manager.save(data);
    }

    let obj = await this.dataSource.manager.findOne(OceanObject, {
      where: { code: record.code },
    });
    if (!obj) {
      obj = new OceanObject();
      obj.code = record.code;
      await this.dataSource.manager.save(obj);
    }

    const state = new OceanObjectState();
    state.reading = this.reading;
    state.object = obj;
    state.geometry = geometry;
    state.data = data;
    await this.dataSource.manager.save(state);
  }

  /**
   * Закончить сессию записи исторических данных
   */
  public async end(): Promise<void>  {
    await this.dataSource.destroy();
    this.reading = void 0;
  }
}
