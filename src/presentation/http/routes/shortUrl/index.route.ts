import { TypeFastifyInstance } from "@shared/types/types.js";
import { createShortUrlRoute } from "./create.route.js";
import { redirectShortUrlRoute } from "./redirect.route.js";

export async function shortUrlRoutes(app: TypeFastifyInstance) {
  app.register(createShortUrlRoute);
  app.register(redirectShortUrlRoute);
}
