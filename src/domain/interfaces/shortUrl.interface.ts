import { IAccessShortUrlLog } from "./accessShortUrlLog.interface";

export interface IShortUrl {
  id: string;
  host: string;
  expiresIn: Date | null;
  deletedAt: Date | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  identifier: string;
  path: string;
  protocol: string;
  AccessShortUrlLogs?: IAccessShortUrlLog[];
}
