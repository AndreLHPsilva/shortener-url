import { z } from "zod";

export const passwordsMatch = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object(shape)
    .refine((data: any) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });


