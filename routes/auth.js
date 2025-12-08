import express from "express";
import bcrypt from "bcrypt";

import { db } from "../database.js";
import { genAccessToken } from "../utils/jwtMethods.js";
import { encryptDeterministic } from "../utils/aesMethods.js";

export const router = express.Router();

// TODO: Separate signup and login and post endpoints
router.post("/api/auth", async (req, res) => {
  try {
    const { email, password, mode } = req.body;

    // Bad requests
    if (!["signup", "login"].includes(mode)) return res.sendStatus(400);
    // TODO: Email and pw format validity (client should handle bad formats before sending the request on login/signup. On login, the error message should just say that all account creds are incorrect (400) if at least one invalid format is present. Formats need to be specified in API docs).

    // TODO: Implement refresh tokens
    // TODO: Implement API tokens
    // TODO: Move database queries
    // TODO: Promisify queries

    const encryptedEmail = encryptDeterministic(email);
    const user = await new Promise((response, rej) => {
      db.get("SELECT * FROM users WHERE email=?", [encryptedEmail], (e, row) => { 
        if (e) rej(e);
        else response(row);
      });
    });

    if (mode == "signup") {
      if (user) return res.sendStatus(409); // Conflict

      const hashPw = await bcrypt.hash(password, 12);

      await new Promise((response, rej) => {
        db.run(
        "INSERT INTO users (email, password, APIToken) VALUES (?, ?, ?)",
        [encryptedEmail, hashPw, null],
        e => { e? rej(e) : response() }
      );
      });
      
      res.status(201); // Created
    } else {
      // Login
      if (!user) return res.sendStatus(400); // No account

      const validPw = await bcrypt.compare(password, user.password);
      if (!validPw) return res.sendStatus(400); // Wrong creds

      res.status(200); // OK
    }
    const accessToken = genAccessToken(email);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * process.env.ACCESS_TOKEN_EXP_MIN,
      path: "/",
      secure: process.env.NODE_ENV === "production", // HTTP localhost
      sameSite: "none" // different localhost ports for frontend and backend 
    });
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
    .clearCookie("sessionToken")
    .clearCookie("isLoggedIn")
    .clearCookie("usrEmail")
    .end();
});
 */