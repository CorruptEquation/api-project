import express from "express";

import { authAccessToken } from "../middleware/jwtMiddleware.js";
import { getAPIToken, genEncryptedAPItk } from "../utils/apiTokenMethods.js"
import { dbUpdateAPITk } from "../database/dbMethods.js";

export const router = express.Router();

// Get API Token
router.get("/api/apitk", authAccessToken, async (req, res) => {
  try {
    const encryptedEmail = req.user.encryptedEmail;
    const APIToken = await getAPIToken(encryptedEmail);
    
    res.json(APIToken ? {APIToken: APIToken} : {message: "You don't have an API token generated."})

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Generate API Token
router.patch("/api/apitk", authAccessToken, async (req, res) => {
  try {
    const encryptedEmail = req.user.encryptedEmail;
    const encryptedAPIToken = genEncryptedAPItk();

    await dbUpdateAPITk([encryptedAPIToken, encryptedEmail]);
    
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});