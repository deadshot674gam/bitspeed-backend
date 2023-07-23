import { DataSource } from "typeorm"
import { Contact } from "../models/Contact"
import { fromBase64, isBase64 } from "../utils/webservice.util"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: isBase64(process.env.DB_PASS)? fromBase64(process.env.DB_PASS) : process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    entities: [Contact],
})