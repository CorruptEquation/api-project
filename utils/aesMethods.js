import crypto from "crypto";

// Could TODO: add integrity (MAC), use AES-SIV (RFC 5297)

const key = Buffer.from(process.env.AES_KEY_USER_EMAIL, "hex");
const alg = "aes-256-ctr";
const IV = Buffer.alloc(16, 0);

export function encryptDeterministic(txt) {
    const cipher = crypto.createCipheriv(alg, key, IV);
    const encrypted = Buffer.concat([
        cipher.update(txt, "utf8"),
        cipher.final()
    ]);
    
    return encrypted.toString("hex");
}

export function decryptDeterministic(txt) {
    const data = Buffer.from(txt, "hex");
    const decipher = crypto.createDecipheriv(alg, key, IV);
    const decrypted = Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}