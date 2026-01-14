import crypto from "crypto";

// TODO?: add integrity (MAC), use AES-SIV (RFC 5297)

const alg = "aes-256-ctr";
const IV = Buffer.alloc(16, 0);

type key = "email" | "apiToken" 

function getKey(keyType: key): Buffer {
    if(keyType === "email")
        return Buffer.from(process.env.AES_KEY_USER_EMAIL!, "hex");
    else if(keyType === "apiToken")
        return Buffer.from(process.env.AES_KEY_USER_APITOKEN!, "hex");
	else throw new Error(`Unknown key type: ${keyType}`);
}

export function encryptDeterministic(txt: string, keyType: key): string {
    const cipher = crypto.createCipheriv(alg, getKey(keyType), IV);
    const encrypted = Buffer.concat([
        cipher.update(txt, "utf8"),
        cipher.final()
    ]);
    
    return encrypted.toString("hex");
}

export function decryptDeterministic(txt: string, keyType: key): string {
    const data = Buffer.from(txt, "hex");
    const decipher = crypto.createDecipheriv(alg, getKey(keyType), IV);
    const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}
