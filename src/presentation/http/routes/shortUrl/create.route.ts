import { createShortUrlController } from "@presentation/http/controllers/shortUrl/create/index.js";
import { CreateShortUrlValidator } from "@presentation/http/controllers/shortUrl/create/types.js";
import { TypeFastifyInstance } from "@shared/types/types.js";
import z from "zod";

export async function createShortUrlRoute(app: TypeFastifyInstance) {
  app.post(
    "/",
    {
      onRequest: [app.optionalAuthenticate],
      schema: {
        description: "Route for register",
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
