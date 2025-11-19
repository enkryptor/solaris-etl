import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

/**
 * Геометрия объекта на поверхности океана.
 */
@Entity({ name: "object_geometry" })
export class OceanObjectGeometry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lat: number;

    @Column()
    lon: number;

    @Column()
    radius: number;
}
