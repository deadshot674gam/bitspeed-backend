import { Request } from "express";
import log4js, { Log4js, Logger} from "log4js"
import log4json from '../config/log4j2.json'


export function toBase64(text: string) : string{
    return Buffer.from(text).toString('base64')
}


export function fromBase64(text: string | undefined) : string | undefined {
    if(typeof text === "undefined") return undefined;
    return Buffer.from(text, 'base64').toString();
}


export function isBase64(value: string| undefined): boolean {
    if(typeof value === "undefined") return false;

    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);
}

export function validQuery(req: Request) : boolean {
    var query = parseQuery(req)

    return !(query["email"] === "garbage" && query["phoneNumber"] === "garbage")
}


export function parseQuery(req: Request) : EQuery {
    return {
        email: typeof req.query["email"] === "string" ? req.query["email"] : "garbage",
        phoneNumber: typeof req.query["phoneNumber"] === "string" ? req.query["phoneNumber"] : "garbage"
    }
}



log4js.configure(log4json)
export class Log {
    logger: Logger
    constructor(classname: string) {
        this.logger = log4js.getLogger(classname)
    }
}