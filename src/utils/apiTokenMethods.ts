import { encryptDeterministic, decryptDeterministic } from "./aesMethods.js";
import { dbGetAPITk } from "../db/dbMethods.js";
import crypto from "crypto";

// Get decrypted API token
export async function getAPIToken(encryptedEmail: string): Promise<string | undefined>  {
  const queryRes = await dbGetAPITk(encryptedEmail); // User maybe deleted from db
  if(queryRes) { 
    const {APIToken: encryptedAPIToken} = queryRes;
	if(encryptedAPIToken && encryptedAPIToken !== null) {
	  return decryptDeterministic(encryptedAPIToken, "apiToken");
	}
  }
  return undefined;
}

export function genEncryptedAPItk(): string {
  return encryptDeterministic(crypto.randomBytes(32).toString("hex"), "apiToken");
}
