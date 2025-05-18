import { z } from "zod";

const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const futureDateString = z.string().refine(
  (val) => {
    if (!dateTimeRegex.test(val)) return false;

    const parsedDate = new Date(val.replace(" ", "T"));
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
  },
  {
    message: "expiresIn must be a future date in format 'yyyy-MM-dd HH:mm:ss'",
  }
);

export const CreateShortUrlValidator = z.object({
  longUrl: z.string().url(),
  expiresIn: z.union([z.null(), futureDateString]),
});

export type ICreateShortUrlRequest = z.infer<typeof CreateShortUrlValidator>;
