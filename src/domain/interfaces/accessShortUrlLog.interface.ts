import { IShortUrl } from "./shortUrl.interface";

export interface IAccessShortUrlLog {
  id: string;
  ip: string;
  shortUrlId: string;
  createdAt: Date;
  updatedAt: Date;
  ShortUrl?: IShortUrl | null;
}
