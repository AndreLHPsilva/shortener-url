import { IShortUrl } from "./shortUrl.interface.js";

export interface IAccessShortUrlLog {
  id: string;
  ip: string;
  shortUrlId: string;
  createdAt: Date;
  updatedAt: Date;
  shortUrl?: IShortUrl;
}
