import cluster from 'cluster';
import os from 'os'
import { debuggingMiddlware, rateLimiterUsingThirdParty } from './src/middlewares/webservice.middleware';
import  ROUTER  from './src/routes/webservice.route';
import dotenv from 'dotenv'
import express, { Express, Router } from 'express';
import { AppDataSource } from './src/services/webservice.db';
import { Log } from './src/utils/webservice.util';
import all_routes from 'express-list-endpoints'
import { identify } from './src/controllers/webservice.controller';
import { initCache } from './src/services/webservice.service';

const totalCPUs: number = os.cpus().length;
dotenv.config();
const LOGGER = new Log("Main").logger
const port = process.env.APP_PORT || 8080;


// if (cluster.isPrimary) {
//     LOGGER.info(`Number of CPUs is ${totalCPUs}`);
//     LOGGER.info(`Master ${process.pid} is running`);
//     // Fork workers. 
//     for (let i = 0; i < totalCPUs; i++) {
//         var worker = cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         LOGGER.info(`worker ${worker.process.pid} died due to signal ${signal}`);
//         LOGGER.info("Let's fork another worker!");
//         cluster.fork();
//     });
// } else {
    const SERVER: Express = express();
    /* registering middlewares */
    SERVER.use(rateLimiterUsingThirdParty);
    // const router = Router()

    
    
    // router.use('/bitspeed', ROUTER);
    // SERVER.use(router)
    SERVER.get('/', debuggingMiddlware, (req, res) => {
        res.json({ 'status': 'RUNNING' });
    });

    SERVER.get('/identify', identify)
    AppDataSource.initialize().then((AppDataSource)=> {
        LOGGER.info("DataSource Client Initialised ...")
        AppDataSource.synchronize(true).then(()=>{
            setInterval(initCache, 10000);
        });
    }).catch((err) =>{
        LOGGER.info(`Error while connecting to db - > ${err}`)
    })


    const app = SERVER.listen(Number(port), '0.0.0.0', () => { LOGGER.info(`Example app listening at http://localhost:${port}`) });

    LOGGER.info(all_routes(SERVER))
// }