import { Router } from "express";
import { identify } from "../controllers/webservice.controller";


const ROUTER = Router();

ROUTER.put('/identify', identify)

export default ROUTER