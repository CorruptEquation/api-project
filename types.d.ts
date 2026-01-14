import { TokenPayload } from "./src/utils/jwtMethods.ts"

declare global {
  namespace Express {
	interface Request {
	  payload?: TokenPayload | string;
	}
  }
}
