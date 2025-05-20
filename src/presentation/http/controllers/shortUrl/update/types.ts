import { z } from "zod";

export const UpdateShortUrlValidator = z.object({
  newUrl: z.string().url(),
  shortUrlId: z.string(),
});

export type IUpdateShortUrlRequest = z.infer<typeof UpdateShortUrlValidator>;
