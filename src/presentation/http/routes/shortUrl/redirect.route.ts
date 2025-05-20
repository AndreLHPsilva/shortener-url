import { redirectShortUrlController } from "@presentation/http/controllers/shortUrl/redirect/index";
import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";

export async function redirectShortUrlRoute(app: TypeFastifyInstance) {
  app.get(
    "/:identifierShortUrl",
    {
      schema: {
        description: "Redirects to the original URL based on the short URL",
        tags: ["short-url"],
        params: z.object({
          identifierShortUrl: z.string(),
        }),
        response: {
          302: z.any(),
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
      return await redirectShortUrlController.handle(request, reply);
    }
  );
}
