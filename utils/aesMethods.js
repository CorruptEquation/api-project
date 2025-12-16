import crypto from "crypto";

// Could TODO: add integrity (MAC), use AES-SIV (RFC 5297)

const alg = "aes-256-ctr";
const IV = Buffer.alloc(16, 0);

function getKey(keyType) {
    if(keyType === "email")
        return Buffer.from(process.env.AES_KEY_USER_EMAIL, "hex");
    else if(keyType === "apiToken")
        return Buffer.from(process.env.AES_KEY_USER_APITOKEN, "hex");
}

export function encryptDeterministic(txt, keyType) {
    const cipher = crypto.createCipheriv(alg, getKey(keyType), IV);
    const encrypted = Buffer.concat([
        cipher.update(txt, "utf8"),
        cipher.final()
    ]);
    
    return encrypted.toString("hex");
}

export function decryptDeterministic(txt, keyType) {
    const data = Buffer.from(txt, "hex");
    const decipher = crypto.createDecipheriv(alg, getKey(keyType), IV);
    const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}