import { Request } from "express";
import log4js, { Log4js, Logger} from "log4js"
import log4json from '../config/log4j2.json'

/**
 * 
 * @param text convert added string to Base64
 * @returns Base64 string
 */
export function toBase64(text: string) : string{
    return Buffer.from(text).toString('base64')
}

/**
 * 
 * @param text convert added Base64 to normal string
 * @returns utf8 string
 */
export function fromBase64(text: string | undefined) : string | undefined {
    if(typeof text === "undefined") return undefined;
    return Buffer.from(text, 'base64').toString();
}

/**
 * 
 * @param value string
 * @returns returns true if value is in base64
 */
export function isBase64(value: string| undefined): boolean {
    if(typeof value === "undefined") return false;

    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);
}

/**
 * 
 * @param req Request
 * @returns checks if the request has email or phoneNumber
 */
export function validQuery(req: Request) : boolean {
    var query = parseQuery(req)

    return !(query["email"] === "garbage" && query["phoneNumber"] === "garbage")
}


/**
 * 
 * @param req Request
 * @returns EQUery format
 */
export function parseQuery(req: Request) : EQuery {
    return {
        email: typeof req.query["email"] === "string" ? req.query["email"] : "garbage",
        phoneNumber: typeof req.query["phoneNumber"] === "string" ? req.query["phoneNumber"] : "garbage"
    }
}



log4js.configure(log4json)

/**
 * Log - logger class 
 */
export class Log {
    logger: Logger
    constructor(classname: string) {
        this.logger = log4js.getLogger(classname)
    }
}