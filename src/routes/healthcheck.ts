import { Router } from 'express';

export const healthcheck = Router();

healthcheck.get('/healthcheck', (req, res) => res.json({ ok: true }));
