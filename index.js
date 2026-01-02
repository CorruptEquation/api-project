import './configENV.js';

import express from "express";
import cors from "cors";

// Import routes
import { router as authRouter } from "./routes/AuthRouter.js";
import { router as APITokenRouter } from "./routes/APITkRouter.js"
import { dbInit } from "./database/dbMethods.js"; 

// Init db
try { 
  await dbInit();
} catch(e) { console.log(e); }

// Setup express server
const app = express();
const port = process.env.PORT || 3000;

// Import middlewares into express
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Setup all routes
app.use(authRouter);
app.use(APITokenRouter);

// Start server
app.listen(port, () => {
  console.log("Recipe API online");
});
