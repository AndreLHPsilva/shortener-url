import { IShortUrl } from "./shortUrl.interface.js";
import { IShortUrlLog } from "./shortUrlLog.interface.js";

export interface IUser {
  id: string;
  email: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
  ShortUrls?: IShortUrl[];
  ShortUrlLogs?: IShortUrlLog[];
}
