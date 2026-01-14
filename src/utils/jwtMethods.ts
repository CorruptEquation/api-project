import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  encryptedEmail: string;
}

export function genRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!);
}

export function genAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXP_MIN) * 60,
  });
}

export function verifyRefreshTk(refreshTk: string): TokenPayload | string { 
  const payload = jwt.verify(refreshTk, process.env.REFRESH_TOKEN_SECRET!); 

  if(typeof(payload) === "string") return payload;

  return payload as TokenPayload;
}

export function verifyAccessTk(accessTk: string): TokenPayload | string {
  const payload = jwt.verify(accessTk, process.env.ACCESS_TOKEN_SECRET!);

  if(typeof(payload) === "string") return payload;

  return payload as TokenPayload;
}
