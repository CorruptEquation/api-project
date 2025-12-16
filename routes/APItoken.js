import express from "express";
import crypto from "crypto";

import { db } from "../database.js";
import { authAccessToken } from "../middleware/middleware.js";
import { encryptDeterministic } from "../utils/aesMethods.js"
import { getAPIToken } from "../utils/apiTokenMethods.js"

export const router = express.Router();

// Get API Token
router.get("/api/apitoken", authAccessToken, async (req, res) => {
  // TRY-CATCH
  const encryptedEmail = req.user.encryptedEmail;
  const APIToken = await getAPIToken(encryptedEmail);
  
  res.json(APIToken ? {APIToken: APIToken} : {message: "You don't have an API token generated."})

  return res.status(200).send();
});

// Generate API Token
router.patch("/api/apitoken", authAccessToken, async (req, res) => {
  // TRY-CATCH
  const encryptedEmail = req.user.encryptedEmail;
  const APIToken = crypto.randomBytes(32).toString("hex");
  const encryptedAPIToken = encryptDeterministic(APIToken, "apiToken");
  await new Promise ((response, rej) => {
    db.run(
      "UPDATE users SET APIToken = ? WHERE email = ?",
      [encryptedAPIToken, encryptedEmail],
      e => { e? rej(e) : response() }
    );
  });
  
  return res.sendStatus(200);
});