import { getAPIToken } from "../utils/apiTokenMethods.js"
import { redis } from "../redis.js";
import { genAccessToken, genRefreshToken } from "./jwtMethods.mjs";

export async function resBody(encryptedEmail, msg) {
  const APIToken = await getAPIToken(encryptedEmail);
  const accessToken = genAccessToken(encryptedEmail);
  const refreshToken = genRefreshToken(encryptedEmail);

  // Add refresh token to cache
  await redis.set(refreshToken, "refresh", { EX: process.env.REFRESH_TOKEN_EXP_SEC });

  const res = {
    "Response": msg,
    accessToken: accessToken,
    refreshToken: refreshToken
  };

  if(APIToken) res.APIToken = APIToken;

  return res;
}
