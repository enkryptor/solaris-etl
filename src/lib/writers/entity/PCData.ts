import { Entity, Column, PrimaryColumn } from "typeorm"

/**
 * Данные физико-химических замеров
 */
@Entity({ name: "pcdata" })
export class OceanObjectPCData {
    @PrimaryColumn({ type: "bigint" })
    hash: number;

    @Column({ type: "bytea" })
    data: Buffer;
}
