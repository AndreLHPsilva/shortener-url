import { signinRoute } from "./signin.route";
import { TypeFastifyInstance } from "@shared/types/types";

export async function authRoutes(app: TypeFastifyInstance) {
  app.register(signinRoute);
}
