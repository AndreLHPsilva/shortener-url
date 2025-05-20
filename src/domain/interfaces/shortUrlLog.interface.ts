import { IShortUrl } from "./shortUrl.interface";
import { IUser } from "./user.interface";

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
