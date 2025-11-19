import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

/**
 * Данные физико-химических замеров
 */
@Entity({ name: "pcdata" })
export class OceanObjectPCData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bytea" })
    data: Buffer;
}
