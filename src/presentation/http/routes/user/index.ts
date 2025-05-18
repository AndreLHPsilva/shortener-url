import { signupRoute } from "./signup.route.js";
import { TypeFastifyInstance } from "@shared/types/types.js";

export async function userRoutes(app: TypeFastifyInstance) {
  app.register(signupRoute);
}
