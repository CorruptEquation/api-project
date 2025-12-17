import jwt from "jsonwebtoken";

export const authAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {
    if (e) return res.sendStatus(403); // Token not valid
    req.user = user;
    next();
  });
};