import z from "zod";
import { TypeFastifyInstance } from "@shared/types/types.js";
import { signinController } from "@presentation/http/controllers/auth/signin/index.js";

export async function signinRoute(app: TypeFastifyInstance) {
  app.post(
    "/signin",
    {
      schema: {
        description: "Route for login",
        tags: ["auth"],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
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
      return await signinController.handle(request, reply);
    }
  );
}
