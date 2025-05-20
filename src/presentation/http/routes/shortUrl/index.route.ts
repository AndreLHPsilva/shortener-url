import { TypeFastifyInstance } from "@shared/types/types";
import { createShortUrlRoute } from "./create.route";
import { listShortUrlRoute } from "./list.route";
import { updateShortUrlRoute } from "./update.route";
import { deleteShortUrlRoute } from "./delete.route";

export async function shortUrlRoutes(app: TypeFastifyInstance) {
  app.register(createShortUrlRoute);
  app.register(listShortUrlRoute);
  app.register(updateShortUrlRoute);
  app.register(deleteShortUrlRoute);
}
