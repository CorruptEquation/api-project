import express from "express";
import bcrypt from "bcrypt";

import { dbGetUser, dbInsertUser, dbRemUser } from "../database/dbMethods.js";
import { genAccessToken, genRefreshToken, verifyRefreshTk } from "../utils/jwtMethods.js";
import { encryptDeterministic } from "../utils/aesMethods.js";
import { getAPIToken } from "../utils/apiTokenMethods.js"
import { redis } from "../redis.js";

export const router = express.Router();

// TODO: Separate signup and login and post endpoints
router.post("/api/auth", async (req, res) => {
  try {
    const { email, password, mode } = req.body;
    const resJsonObj = {};

    // Bad requests
    if (!["signup", "login"].includes(mode)) return res.sendStatus(400);
    // TODO: Email and pw format validity (client should handle bad formats before sending the request on login/signup. On login, the error message should just say that all account creds are incorrect (400) if at least one invalid format is present. Formats need to be specified in API docs).

    // TODO: Create posts and post routes
    // TODO: Send JSON message with status codes
    // TODO: Rewrite source code in TypeScript
    // TODO: Rate limiting

    const encryptedEmail = encryptDeterministic(email, "email");
    const user = await dbGetUser(encryptedEmail);

    if (mode === "signup") {
      if (user) return res.sendStatus(409); // Conflict

      const hashPw = await bcrypt.hash(password, 12);

      await dbInsertUser([encryptedEmail, hashPw]);
      
      res.status(201); // Created
    } else if (mode === "login") {
      if (!user) return res.sendStatus(400); // No account

      const validPw = await bcrypt.compare(password, user.password);
      if (!validPw) return res.sendStatus(400); // Wrong creds
      
      const APIToken = await getAPIToken(encryptedEmail);
      if(APIToken) resJsonObj.APIToken = APIToken;

      res.status(200); // OK
    }
    resJsonObj.accessToken = genAccessToken(encryptedEmail);

    const refreshToken = genRefreshToken(encryptedEmail);
    resJsonObj.refreshToken = refreshToken;
    await redis.set(refreshToken, "refresh", { EX: process.env.REFRESH_TOKEN_EXP_SEC }); // Add refresh token to cache

    res.json(resJsonObj);
    return res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
router.delete("/api/logout", async (req, res) => {
  const refreshTk = req.body.token;
  if (!refreshTk) return res.sendStatus(400);

  await redis.del(refreshTk);
  
  return res.sendStatus(200);
}); 

// TODO: Delete account
router.delete("/api/account", async (req, res) => {
  const refreshTk = req.body.token;
  if (!refreshTk) return res.sendStatus(400);

  await redis.del(refreshTk);

  try{ dbRemUser(verifyRefreshTk(refreshTk)); }
  catch(e) { return }

  return res.sendStatus(200);
})