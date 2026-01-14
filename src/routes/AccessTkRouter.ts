import express from "express";

import { genAccessToken, genRefreshToken } from "../utils/jwtMethods.js";
import { redis } from "../redis.js";
import { verifyRefreshTk } from "../utils/jwtMethods.js";

export const router = express.Router();

// Rotate refresh JWT
router.post("/api/refresh-tk", async (req, res) => {
  try {
    const refreshTk = req.body.token;
    if (!refreshTk) return res.status(401).json({ "Response": "No token provided" });;

    if (!await redis.exists(refreshTk)) return res.status(403).json({ "Response": "Invalid token" });

    let encryptedEmail: string;
    try{
	  const payload = verifyRefreshTk(refreshTk);
	  if (typeof(payload) !== "string")
		({ encryptedEmail } = payload);
	}
    catch(e) { return res.status(403).json({ "Response": "Invalid token" }); }
    
	const accessTk = genAccessToken({ encryptedEmail: encryptedEmail! }) // Generate another access token
    await redis.del(refreshTk); // Remove previous refresh token
    const regenRefreshTk = genRefreshToken({ encryptedEmail: encryptedEmail! }); // Regenerate refresh token
    await redis.set(regenRefreshTk, "refresh", { EX: Number(process.env.REFRESH_TOKEN_EXP_SEC) }); // Add refresh token to cache

    return res.status(200).json({
        "Response": "Token refreshed",
        refreshTk: regenRefreshTk,
        accessTk: accessTk
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
