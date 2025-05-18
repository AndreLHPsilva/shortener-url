import { z } from "zod";

export const DeleteShortUrlValidator = z.object({
  shortUrlId: z.string(),
});

export type IDeleteShortUrlRequest = z.infer<typeof DeleteShortUrlValidator>;
