import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, OneToOne, JoinColumn } from "typeorm"

@Entity({ name: "objects" })
export class OceanObject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    code: string;
}

@Entity({ name: "object_states" })
export class OceanObjectState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    timestamp: Date;

    @ManyToOne(type => OceanObject)
    @JoinColumn({ name: "object_id" })
    object: OceanObject

    @OneToOne(type => OceanObjectGeometry)
    @JoinColumn({ name: "geometry_id" })
    geometry: OceanObjectGeometry;
}

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

@Entity({ name: "pcdata" })
export class OceanObjectPCData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    digest: string;

    @Column()
    data: Buffer;
}
