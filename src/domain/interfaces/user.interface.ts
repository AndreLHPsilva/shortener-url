import { IShortUrl } from "./shortUrl.interface";
import { IShortUrlLog } from "./shortUrlLog.interface";

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
  ShortUrls?: IShortUrl[];
  ShortUrlLogs?: IShortUrlLog[];
}
