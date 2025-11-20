import { Entity, Column, PrimaryColumn } from "typeorm"

/**
 * Геометрия объекта на поверхности океана.
 */
@Entity({ name: "object_geometry" })
export class OceanObjectGeometry {
    @PrimaryColumn({ type: "bigint" })
    hash: number;

    @Column()
    lat: number;

    @Column()
    lon: number;

    @Column()
    radius: number;
}
