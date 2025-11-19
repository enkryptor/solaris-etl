import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "pguser",
    password: "123",
    database: "db",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    migrations: [],
    subscribers: [],
})
