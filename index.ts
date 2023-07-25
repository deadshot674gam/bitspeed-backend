import cluster from 'cluster';
import os from 'os'
import { debuggingMiddlware, rateLimiterUsingThirdParty } from './src/middlewares/webservice.middleware';
import dotenv from 'dotenv'
import express, { Express, Router } from 'express';
import { AppDataSource } from './src/services/webservice.db';
import { Log } from './src/utils/webservice.util';
import { identify } from './src/controllers/webservice.controller';
import { initCache } from './src/services/webservice.service';

const totalCPUs: number = os.cpus().length;
dotenv.config();
const LOGGER = new Log("Main").logger
const port = process.env.APP_PORT || 8080;


const SERVER: Express = express();
/* registering middlewares */
SERVER.use(rateLimiterUsingThirdParty);

SERVER.get('/', debuggingMiddlware, (req, res) => {
    res.json({ 'status': 'RUNNING' });
});

SERVER.get('/identify', identify)


AppDataSource.initialize().then((AppDataSource) => {
    LOGGER.trace("DataSource Client Initialised ...")
    AppDataSource.synchronize(true).then(() => {
        setInterval(initCache, 10000);
    });
}).catch((err) => {
    LOGGER.trace(`Error while connecting to db - > ${err}`)
})


const app = SERVER.listen(Number(port), '0.0.0.0', () => { LOGGER.trace(`Example app listening at http://localhost:${port}`) });

