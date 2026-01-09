import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import jwt from "jsonwebtoken";

export function genRefreshToken(encryptedEmail) {
  return jwt.sign({ encryptedEmail: encryptedEmail }, process.env.REFRESH_TOKEN_SECRET);
}

export function genAccessToken(encryptedEmail) {
  return jwt.sign({ encryptedEmail: encryptedEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXP_MIN}m`,
  });
}

export function verifyRefreshTk(refreshTk) {
  return jwt.verify(refreshTk, process.env.REFRESH_TOKEN_SECRET).encryptedEmail;
}

export function verifyAccessTk(accessTk) {
  return jwt.verify(accessTk, process.env.ACCESS_TOKEN_SECRET).encryptedEmail;
}
