import { updateShortUrlController } from "@presentation/http/controllers/shortUrl/update/index";
import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";

export async function updateShortUrlRoute(app: TypeFastifyInstance) {
  app.put(
    "/:shortUrlId",
    {
      onRequest: [app.authenticate],
      schema: {
        description: "Updates the host of the short URL",
        tags: ["short-url"],
        params: z.object({
          shortUrlId: z.string(),
        }),
        security: [{ bearerAuth: [] }],
        body: z.object({
          newUrl: z.string().url(),
        }),
        response: {
          200: z.null().describe("Short URL updated"),
          404: z.object({
            error: z.object({
              message: z.string(),
              code: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return await updateShortUrlController.handle(request, reply);
    }
  );
}
