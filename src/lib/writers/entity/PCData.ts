import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

/**
 * Данные физико-химических замеров
 */
@Entity({ name: "pcdata" })
export class OceanObjectPCData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint" })
    @Index({ unique: true })
    hash: number;

    @Column({ type: "bytea" })
    data: Buffer;
}
