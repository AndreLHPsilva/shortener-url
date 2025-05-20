import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity";
import { IAccessShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/accessShortUrlLogsRepository.interface";

export class AccessShortUrlLogInMemoryRepository
  implements IAccessShortUrlLogsRepository
{
  constructor(private accessShortUrlLogs: AccessShortUrlLog[] = []) {}

  async create(data: AccessShortUrlLog) {
    const accessShortUrlLogData = data.getProps();
    const shortUrl = accessShortUrlLogData.shortUrl;

    const id = crypto.randomUUID();
    const accessShortUrlLogFinaly = AccessShortUrlLog.create(
      id,
      accessShortUrlLogData.ip,
      accessShortUrlLogData.shortUrl!
    );
    this.accessShortUrlLogs.push(accessShortUrlLogFinaly);
  }
  async findByShortUrlId(
    shortUrlId: string,
    includeShortUrl: boolean = false
  ): Promise<AccessShortUrlLog | null> {
    const accessShortUrlLog = this.accessShortUrlLogs.find(
      (accessShortUrlLog) =>
        accessShortUrlLog.getProps().shortUrlId === shortUrlId
    );

    if (!accessShortUrlLog) {
      return null;
    }

    return accessShortUrlLog;
  }
}
