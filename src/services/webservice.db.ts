import { DataSource } from "typeorm"
import { Contact } from "../models/Contact"
import { Log, fromBase64, isBase64 } from "../utils/webservice.util"
import dotenv from 'dotenv'

const LOGGER = new Log("Main").logger

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: isBase64(process.env.DB_PASS)? fromBase64(process.env.DB_PASS) : process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    entities: [Contact]
})
