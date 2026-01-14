import './configENV';
import express from "express";
import cors from "cors";

// Import routes
import { router as authRouter } from "./routes/AuthRouter";
import { router as APITokenRouter } from "./routes/APITkRouter"
import { router as accessTkRouter } from './routes/AccessTkRouter';
import { dbInit } from "./db/dbMethods"; 



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
app.use(accessTkRouter);

// Start server
app.listen(port, () => {
  console.log("Recipe API online");
});
