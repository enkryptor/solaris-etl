import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

/**
 * Объект на поверхности океана
 */
@Entity({ name: "objects" })
export class OceanObject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    code: string;
}
