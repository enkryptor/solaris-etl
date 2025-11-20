import { xxh32 } from "@node-rs/xxhash";
import { HistoryRecord, Writer } from "../../interfaces";
import { dataSourceFactory } from "./data-source";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanReading } from "./entity/Reading";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObject } from "./entity/Object";
import { OceanObjectState } from "./entity/ObjectState";

/**
 * "Инкрементальный" записыватель исторических данных в PostgreSQL.
 * 
 * Копит данные и записывает пачками по возможности одним запросом.
 */
export class IncrementalWriter implements Writer<Date, HistoryRecord> {
    constructor(private batchSize = 10) {}

    start(initialData: Date): Promise<void> {
        throw new Error("Method not implemented.");
    }
    write(record: HistoryRecord): Promise<void> {
        throw new Error("Method not implemented.");
    }
    end(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
