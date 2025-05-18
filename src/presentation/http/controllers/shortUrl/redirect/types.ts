import { z } from "zod";

export const RedirectShortUrlValidator = z.object({
  identifierShortUrl: z.string(),
});

export type ICreateShortUrlRequest = z.infer<typeof RedirectShortUrlValidator>;
