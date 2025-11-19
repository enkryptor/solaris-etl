import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, OneToOne, JoinColumn } from "typeorm"
import { OceanObjectPCData } from "./PCData";

/**
 * Хэш данных физико-химических замеров
 */
@Entity({ name: "pcdata_hash" })
export class OceanObjectPCDataHash {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint" })
    @Index({ unique: true })
    hash: number;

    @OneToOne(type => OceanObjectPCData)
    @JoinColumn({ name: "data_id" })
    data: OceanObjectPCData;
}
