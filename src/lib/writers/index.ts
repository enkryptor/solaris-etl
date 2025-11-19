import { xxh32 } from "@node-rs/xxhash";
import { HistoryRecord } from "../../interfaces";
import { AppDataSource } from "./data-source";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanReading } from "./entity/Reading";
import { OceanObjectPCDataHash } from "./entity/PCDataHash";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObject } from "./entity/Object";
import { OceanObjectState } from "./entity/ObjectState";

export class WriterSQL {
  private reading?: OceanReading;

  /**
   * Начать сессию записи исторических данных
   */
  public async start(timestamp: Date) {
    if (this.reading) {
      throw new Error("Reading is already started");
    }

    await AppDataSource.initialize();
    const reading = new OceanReading();
    reading.timestamp = timestamp;
    await AppDataSource.manager.save(reading);
  }

  /**
   * Записать исторические данные
   */
  public async write(record: HistoryRecord) {
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
    state.reading = this.reading;
    state.object = obj;
    state.geometry = geometry;
    state.hash = hash;
    return await AppDataSource.manager.save(state);
  }

  /**
   * Закончить сессию записи исторических данных
   */
  public async end() {
    await AppDataSource.destroy();
    this.reading = void 0;
  }
}
