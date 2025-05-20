import { listShortUrlController } from "@presentation/http/controllers/shortUrl/list/index";
import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";

export async function listShortUrlRoute(app: TypeFastifyInstance) {
  app.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        description: "Route for list short urls by user",
        tags: ["short-url"],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            shortUrls: z.array(
              z.object({
                id: z.string(),
                longUrl: z.string(),
                shortUrl: z.string(),
                sumAccess: z.number(),
                createdAt: z.string(),
                updatedAt: z.string(),
                links: z.array(
                  z.object({
                    rel: z.string(),
                    method: z.string(),
                    href: z.string(),
                  })
                ),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      return await listShortUrlController.handle(request, reply);
    }
  );
}
