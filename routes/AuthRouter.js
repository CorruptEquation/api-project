// TODO: Create posts and post routes
// TODO: Send JSON message with status codes
// TODO: Rewrite source code in TypeScript
// TODO: Rate limiting

import express from "express";
import bcrypt from "bcrypt";

import { dbGetUser, dbInsertUser, dbRemUser } from "../database/dbMethods.js";
import { verifyRefreshTk } from "../utils/jwtMethods.js";
import { encryptDeterministic } from "../utils/aesMethods.js";
import { redis } from "../redis.js";
import { resBody } from "../utils/utils.js";

export const router = express.Router();

// Signup
router.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Bad requests. Email and pw format validity (client should handle bad formats before sending the request on login/signup. On login, the error message should just say that all account creds are incorrect (400) if at least one invalid format is present. Formats need to be specified in API docs).

    const encryptedEmail = encryptDeterministic(email, "email");
    const user = await dbGetUser(encryptedEmail);
    if (user) return res.status(409).json({ "Response": "Account already attached to this email" });
    const hashPw = await bcrypt.hash(password, 12);
    await dbInsertUser([encryptedEmail, hashPw]);

    return res.status(201).json(await resBody(encryptedEmail, "Account created successfully"));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
})

// Login
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Bad requests. Email and pw format validity (client should handle bad formats before sending the request on login/signup. On login, the error message should just say that all account creds are incorrect (400) if at least one invalid format is present. Formats need to be specified in API docs).

    const encryptedEmail = encryptDeterministic(email, "email");
    const user = await dbGetUser(encryptedEmail);
    if (!user) return res.status(400).json({ "Response": "Invalid credentials" });

    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw) return res.status(400).json({ "Response": "Invalid credentials" });

    return res.status(200).json(await resBody(encryptedEmail, "Login successful"));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
router.delete("/api/logout", async (req, res) => {
  try {
    const refreshTk = req.body.token;
    if (!refreshTk) return res.status(400).json({ "Response": "No token inside request body" });

    await redis.del(refreshTk);
    
    return res.status(200).json({ "Response": "Logout successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}); 

// Delete account
router.delete("/api/account", async (req, res) => {
  try {
    const refreshTk = req.body.token;
    if (!refreshTk) return res.status(400).json({ "Response": "No token inside request body" });

    await redis.del(refreshTk);

    try { await dbRemUser(verifyRefreshTk(refreshTk)); }
    catch(e) { return }

    return res.status(200).json({ "Response": "Account deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
})