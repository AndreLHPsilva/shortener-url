import { IShortUrl } from "./shortUrl.interface.js";
import { IUser } from "./user.interface.js";

export interface IShortUrlLog {
  id: string;
  shortUrlId: string;
  newValue: string;
  oldValue: string;
  userId: string;
  updatedAt: Date;
  ShortUrl?: IShortUrl;
  user?: IUser;
}
