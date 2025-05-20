import { TypeFastifyInstance } from "@shared/types/types";
import z from "zod";
import { createUserController } from "@presentation/http/controllers/user/create/index";
import { CreateUserValidator } from "@presentation/http/controllers/user/create/types";

export async function signupRoute(app: TypeFastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        description: "Route for register",
        tags: ["users"],
        body: CreateUserValidator,
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
