import { Entity, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from "typeorm"
import { OceanReading } from "./Reading";
import { OceanObject } from "./Object";
import { OceanObjectGeometry } from "./Geometry";
import { OceanObjectPCData } from "./PCData";

/**
 * Состояние объекта на момент замера
 */
@Entity({ name: "object_states" })
export class OceanObjectState {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @ManyToOne(type => OceanReading)
    @JoinColumn({ name: "reading_id" })
    reading: OceanReading;

    @ManyToOne(type => OceanObject)
    @JoinColumn({ name: "object_id" })
    object: OceanObject

    @ManyToOne(type => OceanObjectGeometry)
    @JoinColumn({ name: "geometry_id" })
    geometry: OceanObjectGeometry;

    @ManyToOne(type => OceanObjectPCData)
    @JoinColumn({ name: "pcdata_id" })
    data: OceanObjectPCData;
}
