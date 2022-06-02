import { RequestHandler } from "express";

export type Roll = {
    location: string;
    people: string[];
};

/**
 * POST /rollcall/submit
 */
export const submitRoll: RequestHandler = async (req, res) => {};

/**
 * GET /rollcall?days=
 */
export const getRoll: RequestHandler = async (req, res) => {
    res.json({});
};
