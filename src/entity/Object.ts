import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, OneToOne, JoinColumn } from "typeorm"


// Объект на поверхности

// Объект идентифицируется кодом (текстовая строка)
// Версия объекта идентифицируется датой, не может быть две версии на одну дату-время
// соотв. для поиска версии используется код+дата

// В новых данных могут прийти неизмененные данные, или повториться с тем что уже было:
// 1, 1, 2, 3, 1

// Блобы пишем отдельно, остальные данные дублируем в записях состояний, даже если они не изменились


// НФТ
// количество данных: сотни тысяч записей о состоянии всех существующих объектов
// новые данные приходят раз в час
// BLOB десятки мегабайт
// менее чем за час надо загрузить все данные


// Таблица состояний объектов

// id (PK)
// дата-время версии (b-tree)
// объект: FK в таблице объектов
// данные геометрии: FK в таблице геометрии
// данные физико-химического зондирования: FK в таблице блобов


// Таблица объектов

// id
// код: строка (b-tree)


// таблица геометрии

// широта: double
// долгота: double
// радиус описаной окружности: double


// таблица блобов

// id (PK)
// ByteA (hash index)

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
