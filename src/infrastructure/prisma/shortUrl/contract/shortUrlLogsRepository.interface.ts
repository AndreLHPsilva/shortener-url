import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity.js";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";

export interface IShortUrlLogsRepository {
  create: (data: ShortUrlLog) => Promise<any>;
}
