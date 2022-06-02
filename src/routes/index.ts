import { Router } from "express";

export const index = Router();

index.get("/healthcheck", (req, res) => res.json({ ok: true }));
