import { signinRoute } from "./signin.route.js";
import { TypeFastifyInstance } from "@shared/types/types.js";

export async function authRoutes(app: TypeFastifyInstance) {
  app.register(signinRoute);
}
