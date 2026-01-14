import { getAPIToken } from "./apiTokenMethods.js"
import { redis } from "../redis.js";
import { genAccessToken, genRefreshToken } from "./jwtMethods.js";

export async function resBody(encryptedEmail: string, msg: string) {
  const APIToken = await getAPIToken(encryptedEmail);
  const accessToken = genAccessToken({encryptedEmail});
  const refreshToken = genRefreshToken({encryptedEmail});

  // Add refresh token to cache
  await redis.set(refreshToken, "refresh", { EX: Number(process.env.REFRESH_TOKEN_EXP_SEC) });

  const res: {
	Response: string;
	accessToken: string;
	refreshToken: string;
	APIToken?: string;
  } = {
    Response: msg,
    accessToken: accessToken,
    refreshToken: refreshToken
  };

  if(APIToken) res.APIToken = APIToken;

  return res;
}
