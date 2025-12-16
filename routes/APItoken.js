import express from "express";
import crypto from "crypto";

import { db } from "../database.js";
import { authAccessToken } from "../middleware/middleware.js";
import { decryptDeterministic, encryptDeterministic } from "../utils/aesMethods.js"

export const router = express.Router();

router.get("/api/get-apitoken", authAccessToken, async (req, res) => {
  // TRY-CATCH
  const encryptedEmail = req.user.encryptedEmail;
  const {APIToken: encryptedAPIToken} = await new Promise ((response, rej) => {
    db.get("SELECT APIToken FROM users WHERE email=?", [encryptedEmail], (e, row) => {
        if (e) rej(e);
        response(row);
      }
    );
  });
  const decryptedAPIToken = encryptedAPIToken && decryptDeterministic(encryptedAPIToken, "apiToken");

  return res
    .status(200)
    .json({APIToken: decryptedAPIToken});
});

router.patch("/api/gen-apitoken", authAccessToken, async (req, res) => {
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