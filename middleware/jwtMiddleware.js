import jwt from "jsonwebtoken";

export const authAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ "Response": "No bearer token found" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {
    if (e) return res.status(403).json({ "Response": "Token not valid" });
    req.user = user;
    next();
  });
};
