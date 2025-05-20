import { signupRoute } from "./signup.route";
import { TypeFastifyInstance } from "@shared/types/types";

export async function userRoutes(app: TypeFastifyInstance) {
  app.register(signupRoute);
}
