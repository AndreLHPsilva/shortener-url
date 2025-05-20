import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity";

export interface IAccessShortUrlLogsRepository {
  create: (data: AccessShortUrlLog) => Promise<any>;
  findByShortUrlId: (shortUrlId: string) => Promise<AccessShortUrlLog | null>;
}
