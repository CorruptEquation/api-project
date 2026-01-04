import express from "express";

import { genAccessToken, genRefreshToken } from "../utils/jwtMethods.js";
import { redis } from "../redis.js";
import { verifyRefreshTk } from "../utils/jwtMethods.js";

export const router = express.Router();

// Rotate refresh JWT
router.post("/api/refresh-tk", async (req, res) => {
  try {
    const refreshTk = req.body.token;
    if (!refreshTk) return res.sendStatus(401); // No token
    if (!await redis.exists(refreshTk)) return res.sendStatus(403); // Token expired
    let encryptedEmail = undefined;
    try{ encryptedEmail = verifyRefreshTk(refreshTk); }
    catch(e) { return res.status(403).json({ error: "Token not valid" }).send(); }
    const accessTk = genAccessToken(encryptedEmail) // Generate another access token
    await redis.del(refreshTk); // Remove previous refresh token
    const regenRefreshTk = genRefreshToken(encryptedEmail); // Regenerate refresh token
    await redis.set(regenRefreshTk, "refresh", { EX: process.env.REFRESH_TOKEN_EXP_SEC }); // Add refresh token to cache

    return res.status(200).json({
        refreshTk: regenRefreshTk,
        accessTk: accessTk
      }).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
