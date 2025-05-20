import { z } from "zod";
import { passwordsMatch } from "@shared/utils/zod/index";

export const CreateUserValidator = passwordsMatch({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  name: z.string().min(3),
});

export type ICreateUser = z.infer<typeof CreateUserValidator>;
