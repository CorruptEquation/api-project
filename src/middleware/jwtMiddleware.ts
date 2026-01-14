import { verifyAccessTk } from "../utils/jwtMethods";
import { TokenPayload } from "../utils/jwtMethods";
import { RequestHandler } from "express";

export const authAccessToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ "Response": "No bearer token found" });

  let payload: TokenPayload | string;
  try { payload = verifyAccessTk(token); }
  catch (e) { return res.status(403).json({ "Response": "Token not valid" }); }

  req.payload = payload;
  return next();
};
