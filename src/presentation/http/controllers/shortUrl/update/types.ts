import { z } from "zod";

export const UpdateShortUrlValidator = z.object({
  host: z.string(),
  shortUrlId: z.string(),
});

export type IUpdateShortUrlRequest = z.infer<typeof UpdateShortUrlValidator>;
