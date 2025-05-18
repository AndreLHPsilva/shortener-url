import { z } from "zod";

export const SigninValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type ICreateUser = z.infer<typeof SigninValidator>;
