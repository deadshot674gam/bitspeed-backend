import { NextFunction, Request, Response } from "express";
import { AppDataSource } from '../services/webservice.db';
import { Contact } from '../models/Contact';
import { Log } from "../utils/webservice.util";
const LOGGER = new Log("middlware").logger

// export const rateLimiterUsingThirdParty = rateLimit({
//   windowMs: 10000, // 10 Milliseconds
//   max: 10000,
//   message: 'You have exceeded the 10000 requests in 10 seconds limit!', 
//   standardHeaders: true,
//   legacyHeaders: false,
// });

/**
 * @description a middlware for checking DB content 
 * @param req 
 * @param res 
 * @param next 
 */
export async function debuggingMiddlware(req: Request, res: Response, next: NextFunction) {
  let contacts = AppDataSource.getRepository(Contact)
  LOGGER.trace(` This is db -> ${JSON.stringify(await contacts.find())}`)

  next();
}

export async function contentTypeHandler(req: Request, res: Response, next: NextFunction) {
  if(req.headers["content-type"] === "application/json") next();
  else res.send({
    status: 302,
    body: "Application/JSON required"
  })
}