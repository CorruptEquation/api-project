import { db } from "../database.js";
import { decryptDeterministic } from "./aesMethods.js";

// Get decrypted API token
export async function getAPIToken(encryptedEmail) {
    const {APIToken: encryptedAPIToken} = await new Promise ((response, rej) => {
        db.get("SELECT APIToken FROM users WHERE email=?", [encryptedEmail], (e, row) => {
            if (e) rej(e);
            response(row);
          }
        );
      });
      
      return encryptedAPIToken && decryptDeterministic(encryptedAPIToken, "apiToken");
}