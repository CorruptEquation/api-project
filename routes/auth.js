import express from "express";
import bcrypt from "bcrypt";

import { dbGetUser, dbInsertUser } from "../database/dbMethods.js";
import { genAccessToken, genRefreshToken } from "../utils/jwtMethods.js";
import { encryptDeterministic } from "../utils/aesMethods.js";
import { getAPIToken } from "../utils/apiTokenMethods.js"

export const router = express.Router();

// TODO: Separate signup and login and post endpoints
router.post("/api/auth", async (req, res) => {
  try {
    const { email, password, mode } = req.body;
    const resJsonObj = {};

    // Bad requests
    if (!["signup", "login"].includes(mode)) return res.sendStatus(400);
    // TODO: Email and pw format validity (client should handle bad formats before sending the request on login/signup. On login, the error message should just say that all account creds are incorrect (400) if at least one invalid format is present. Formats need to be specified in API docs).

    // TODO: Implement refresh tokens and rotation
    // TODO: Implement API tokens verification to access posts
    // TODO: Send JSON message with status codes

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
    resJsonObj.refreshToken = genRefreshToken(encryptedEmail);
    res.json(resJsonObj);
    return res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* // Logout
router.patch("/api/logout", authSessionToken, (_, res) => {
  return res
    .status(200)
    
    .end();
});
 */