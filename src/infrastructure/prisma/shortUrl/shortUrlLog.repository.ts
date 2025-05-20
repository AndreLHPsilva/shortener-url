import { prisma } from "../prisma";
import { IShortUrlLogsRepository } from "./contract/shortUrlLogsRepository.interface";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity";

export class ShortUrlLogRepository implements IShortUrlLogsRepository {
  constructor(private repository = prisma.shortUrlLogs) {}

  async create(shortUrl: ShortUrlLog): Promise<void> {
    const shortUrlData = shortUrl.getProps();
    await this.repository.create({
      data: {
        updatedAt: shortUrlData.updatedAt,
        oldValue: shortUrlData.oldValue,
        newValue: shortUrlData.newValue,
        action: shortUrlData.action,
        user: {
          connect: {
            id: shortUrlData.userId,
          },
        },
        shortUrl: {
          connect: {
            id: shortUrlData.shortUrlId,
          },
        },
      },
    });

    return;
  }
}
