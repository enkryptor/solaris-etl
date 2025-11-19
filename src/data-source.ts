import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "./entity/User";
import { OceanObject } from "./entity/Object";
import { OceanReading } from "./entity/Reading";
import { OceanObjectState } from "./entity/ObjectState";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObjectPCDataHash } from "./entity/PCDataHash";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "pguser",
  password: "123",
  database: "db",
  synchronize: true,
  logging: false,
  entities: [
    OceanObject,
    OceanReading,
    OceanObjectState,
    OceanObjectGeometry,
    OceanObjectPCData,
    OceanObjectPCDataHash,
  ],
  migrations: [],
  subscribers: [],
});
