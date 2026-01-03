import { encryptDeterministic, decryptDeterministic } from "./aesMethods.js";
import { dbGetAPITk } from "../database/dbMethods.js";
import crypto from "crypto";

// Get decrypted API token
export async function getAPIToken(encryptedEmail) {
  const queryRes = await dbGetAPITk(encryptedEmail); // User maybe deleted from db
  if(queryRes) { 
    const {APIToken: encryptedAPIToken} = queryRes;
    return encryptedAPIToken && decryptDeterministic(encryptedAPIToken, "apiToken");
  } else return undefined;
}

export function genEncryptedAPItk() {
  return encryptDeterministic(crypto.randomBytes(32).toString("hex"), "apiToken");
}