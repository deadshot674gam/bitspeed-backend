import { NextFunction, Request, Response } from "express";
import { parseQuery, validQuery } from "../utils/webservice.util";
import { checkIfExistingPrimary, fetchRecords, insertDB } from "../services/webservice.service";
import { Log } from "../utils/webservice.util";
const LOGGER = new Log("Main").logger


/**
 * @description main endpoint
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
export async function identify(req: Request, res: Response, next: NextFunction) {

    if(validQuery(req)) {
        var query = parseQuery(req)
        LOGGER.trace(`Query received - ${JSON.stringify(query)}`)
        checkIfExistingPrimary(query).then((hasPrimary)=>{
            LOGGER.trace(`Result from checkIfExistingPrimary - > ${hasPrimary}`)
            insertDB(query, !hasPrimary).then(()=>{
                fetchRecords(query).then((response)=>{
                    LOGGER.trace(`Response - > ${JSON.stringify(response)}`) 
                    res.send({
                        "contacts" : response
                    })
                }).catch((reason)=>{
                    LOGGER.error(JSON.stringify(reason))
                })
            }).catch((reason)=>{
                LOGGER.error(JSON.stringify(reason))
            })

            
        }).catch((reason)=>{
            LOGGER.error(JSON.stringify(reason))
        })
    }else{
        LOGGER.trace("Not a valid Query")
        res.send("Not a Valid Query")
    }
    
}