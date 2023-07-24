import cluster from 'cluster';
import os from 'os'
import { rateLimiterUsingThirdParty } from './src/middlewares/webservice.middleware';
import { ROUTER } from './src/routes/webservice.route';
import dotenv from 'dotenv'
import express, { Express } from 'express';
import { AppDataSource } from './src/services/webservice.db';


const totalCPUs: number = os.cpus().length;
dotenv.config();

const port = process.env.APP_PORT || 8080;


if (cluster.isPrimary) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
    // Fork workers. 
    for (let i = 0; i < totalCPUs; i++) {
        var worker = cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died due to signal ${signal}`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    const SERVER: Express = express();
    /* registering middlewares */
    SERVER.use(rateLimiterUsingThirdParty);

    SERVER.get('/', (req, res) => {
        res.json({ 'status': 'RUNNING' });
    });

    AppDataSource.initialize().then((AppDataSource)=> {
        console.log("DataSource Client Initialised ...")
    }).catch((err) =>{
        console.log(`Error while connecting to db - > ${err}`)
    })


    SERVER.use('/bitspeed-backend', ROUTER);
    const app = SERVER.listen(Number(port), '0.0.0.0', () => { console.log(`Example app listening at http://localhost:${port}`) });
}