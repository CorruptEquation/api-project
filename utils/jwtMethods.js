import jwt from "jsonwebtoken";

export function genRefreshToken(email) {
  return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET);
}

export function genAccessToken(encryptedEmail) {
  return jwt.sign({ encryptedEmail: encryptedEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXP_MIN}m`,
  });
}
