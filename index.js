import './configENV.js';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import { router as authRouter } from "./routes/auth.js";

// Setup express server
const app = express();
const port = 3000;

// Import middlewares into express
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Setup all routes
app.use(authRouter);

// Start server
app.listen(port, () => {
  console.log("Recipe API online");
});
