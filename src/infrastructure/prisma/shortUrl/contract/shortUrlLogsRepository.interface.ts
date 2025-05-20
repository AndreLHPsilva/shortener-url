import { ShortUrlLog } from "@domain/entities/shortUrlLog.entity";

export interface IShortUrlLogsRepository {
  create: (data: ShortUrlLog) => Promise<any>;
}
