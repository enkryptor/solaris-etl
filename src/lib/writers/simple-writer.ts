import { HistoryRecord } from "../../interfaces";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObject } from "./entity/Object";
import { OceanObjectState } from "./entity/ObjectState";
import { BaseWriter } from "./base-writer";

/**
 * "Наивный" записыватель исторических данных в PostgreSQL.
 * 
 * Пишет сущности по одной, создавая зависимости отдельными запросами.
 * Перед записью блоба данных ищет уже существующий с тем же хэшем.
 */
export class SimpleWriter extends BaseWriter {
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
    const rowHash = this.getBufferHash(rowData);

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
}
