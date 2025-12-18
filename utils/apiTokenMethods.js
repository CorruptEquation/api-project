import { encryptDeterministic, decryptDeterministic } from "./aesMethods.js";
import { dbGetAPITk } from "../database/dbMethods.js";
import crypto from "crypto";

// Get decrypted API token
export async function getAPIToken(encryptedEmail) {
  const {APIToken: encryptedAPIToken} = await dbGetAPITk(encryptedEmail);
  return encryptedAPIToken && decryptDeterministic(encryptedAPIToken, "apiToken");
}

export function genEncryptedAPItk() {
  return encryptDeterministic(crypto.randomBytes(32).toString("hex"), "apiToken");
}