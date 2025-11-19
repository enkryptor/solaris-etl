import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

/**
 * Замер состояния объекта на поверхности океана
 */
@Entity({ name: "readings" })
export class OceanReading {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "timestamp" })
    @Index()
    timestamp: Date;
}
