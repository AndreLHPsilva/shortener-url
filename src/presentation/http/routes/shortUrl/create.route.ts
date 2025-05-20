import { createShortUrlController } from "@presentation/http/controllers/shortUrl/create/index";
import { CreateShortUrlValidator } from "@presentation/http/controllers/shortUrl/create/types";
import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";

export async function createShortUrlRoute(app: TypeFastifyInstance) {
  app.post(
    "/",
    {
      onRequest: [app.optionalAuthenticate],
      schema: {
        description: "Route for create short url",
        tags: ["short-url"],
        security: [{ bearerAuth: [] }],
        body: CreateShortUrlValidator,
        response: {
          201: z.object({
            shortUrl: z.string(),
          }),
          400: z.object({
            error: z.object({
              message: z.string(),
              code: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      return await createShortUrlController.handle(request, reply);
    }
  );
}
