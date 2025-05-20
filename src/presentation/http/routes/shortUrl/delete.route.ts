import { deleteShortUrlController } from "@presentation/http/controllers/shortUrl/delete/index";
import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";

export async function deleteShortUrlRoute(app: TypeFastifyInstance) {
  app.delete(
    "/:shortUrlId",
    {
      onRequest: [app.authenticate],
      schema: {
        description: "Deletes the short URL",
        tags: ["short-url"],
        params: z.object({
          shortUrlId: z.string(),
        }),
        security: [{ bearerAuth: [] }],
        response: {
          200: z.null().describe("Short URL deleted"),
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
      return await deleteShortUrlController.handle(request, reply);
    }
  );
}
