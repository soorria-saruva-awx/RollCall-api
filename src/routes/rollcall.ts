import { Router } from "express";
import * as controller from "../controllers/rollcall";

export const rollcall = Router();

rollcall.get("/", controller.getRoll);
rollcall.post("/submit", controller.submitRoll);
