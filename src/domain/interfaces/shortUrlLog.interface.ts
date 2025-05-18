import { IShortUrl } from "./shortUrl.interface.js";
import { IUser } from "./user.interface.js";

export enum EActionShortUrlLog {
  DELETE = "DELETE",
  UPDATE = "UPDATE",
}

export interface IShortUrlLog {
  id: string;
  shortUrlId: string;
  newValue: string;
  oldValue: string;
  userId: string;
  action: EActionShortUrlLog;
  updatedAt: Date;
  ShortUrl?: IShortUrl;
  user?: IUser;
}
