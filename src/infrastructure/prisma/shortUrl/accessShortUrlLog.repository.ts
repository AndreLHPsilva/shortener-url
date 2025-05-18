import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity.js";
import { prisma } from "../prisma.js";
import { IAccessShortUrlLogsRepository } from "./contract/accessShortUrlLogsRepository.interface.js";

export class AccessShortUrlLogRepository
  implements IAccessShortUrlLogsRepository
{
  constructor(private repository = prisma.accessShortUrlLogs) {}

  async create(data: AccessShortUrlLog) {
    const accessShortUrlLogData = data.getProps();
    const shortUrl = accessShortUrlLogData.shortUrl;
    await this.repository.create({
      data: {
        ip: accessShortUrlLogData.ip,
        createdAt: accessShortUrlLogData.createdAt,
        updatedAt: accessShortUrlLogData.updatedAt,
        shortUrl: {
          connect: {
            id: shortUrl!.getProps().id!,
          },
        },
      },
    });
  }
  async findByShortUrlId(
    shortUrlId: string,
    includeShortUrl: boolean = false
  ): Promise<AccessShortUrlLog | null> {
    const accessShortUrlLog = await this.repository.findFirst({
      where: {
        shortUrl: {
          id: shortUrlId,
        },
      },
      include: {
        ...(includeShortUrl ? { shortUrl: true } : {}),
      },
    });

    if (!accessShortUrlLog) {
      return null;
    }

    return AccessShortUrlLog.transformFromInternalClass(accessShortUrlLog);
  }
}
