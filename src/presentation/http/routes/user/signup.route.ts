import { TypeFastifyInstance } from "@shared/types/types.js";
import z from "zod";
import { passwordsMatch } from "@shared/utils/zod/index.js";
import { createUserController } from "@presentation/http/controllers/user/create/index.js";

export async function signupRoute(app: TypeFastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        description: "Route for register",
        tags: ["users"],
        body: passwordsMatch({
          email: z.string().email(),
          password: z.string().min(6),
          confirmPassword: z.string(),
          name: z.string().min(3),
        }),
        response: {
          201: z.null().describe("User created"),
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
      return await createUserController.handle(request, reply);
    }
  );
}
