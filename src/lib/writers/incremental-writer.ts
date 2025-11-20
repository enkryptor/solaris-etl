import { xxh32 } from "@node-rs/xxhash";
import { HistoryRecord, Writer } from "../../interfaces";
import { dataSourceFactory } from "./data-source";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanReading } from "./entity/Reading";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObject } from "./entity/Object";
import { OceanObjectState } from "./entity/ObjectState";
import { BaseWriter } from "./base-writer";

/**
 * "Инкрементальный" записыватель исторических данных в PostgreSQL.
 * 
 * Вычитывает предыдущее состояние и создаёт новые данные только если они изменились.
 */
export class IncrementalWriter extends BaseWriter {
    write(record: HistoryRecord): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
