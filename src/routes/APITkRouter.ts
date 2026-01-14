import express from "express";

import { authAccessToken } from "../middleware/jwtMiddleware";
import { getAPIToken, genEncryptedAPItk } from "../utils/apiTokenMethods"
import { dbUpdateAPITk } from "../db/dbMethods";

export const router = express.Router();

// Get API Token
router.get("/api/apitk", authAccessToken, async (req, res) => {
  try {
	const payload = req.payload;
	let encryptedEmail: string;
	if(payload && typeof(payload) !== "string")
	  ({ encryptedEmail } = payload)
    const APIToken = await getAPIToken(encryptedEmail!);

    return res.status(200).json(APIToken ? { APIToken: APIToken } : { "Response": "You don't have an API token generated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Generate API Token
router.patch("/api/apitk", authAccessToken, async (req, res) => {
  try {
	const payload = req.payload;
	let encryptedEmail: string;
	if(payload && typeof(payload) !== "string")
	  ({ encryptedEmail } = payload)
    
	const encryptedAPIToken = genEncryptedAPItk();

    await dbUpdateAPITk(encryptedAPIToken, encryptedEmail!);
    
    return res.status(200).json({ "Response": "API token generated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
