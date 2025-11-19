import "reflect-metadata";
import { DataSource } from "typeorm";
import { OceanObject } from "./entity/Object";
import { OceanReading } from "./entity/Reading";
import { OceanObjectState } from "./entity/ObjectState";
import { OceanObjectGeometry } from "./entity/Geometry";
import { OceanObjectPCData } from "./entity/PCData";
import { OceanObjectPCDataHash } from "./entity/PCDataHash";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
