import { TypeFastifyInstance } from "@shared/types/types.js";
import { createShortUrlRoute } from "./create.route.js";
import { listShortUrlRoute } from "./list.route.js";
import { updateShortUrlRoute } from "./update.route.js";
import { deleteShortUrlRoute } from "./delete.route.js";

export async function shortUrlRoutes(app: TypeFastifyInstance) {
  app.register(createShortUrlRoute);
  app.register(listShortUrlRoute);
  app.register(updateShortUrlRoute);
  app.register(deleteShortUrlRoute);
}
