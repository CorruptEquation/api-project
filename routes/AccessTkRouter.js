import express from "express";
import jwt from "jsonwebtoken";

import { genAccessToken, genRefreshToken } from "../utils/jwtMethods.js";
import { redis } from "../redis.js";

export const router = express.Router();

// Rotate refresh JWT
router.post("/api/refresh-tk", async (req, res) => {
  const refreshTk = req.body.token;
  if (!refreshTk) return res.sendStatus(401); // No token
  if (!await redis.exists(refreshTk)) return res.sendStatus(403); // Token expired
  jwt.verify(refreshTk, process.env.REFRESH_TOKEN_SECRET, async (e, obj) => {
    if (e) return res.sendStatus(403); // Token not valid
    const accessTk = genAccessToken(obj.encryptedEmail) // Generate another access token
    await redis.del(refreshTk); // Remove previous refresh token
    const regenRefreshTk = genRefreshToken(obj.encryptedEmail); // Regenerate refresh token
    await redis.set(regenRefreshTk, "refresh", { EX: process.env.REFRESH_TOKEN_EXP_SEC }); // Add refresh token to cache

    return res.status(200).json({
      refreshTk: regenRefreshTk,
      accessTk: accessTk
    }).send();
  })
});
