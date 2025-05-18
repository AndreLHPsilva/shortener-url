import { toSpISOString } from "@shared/utils/date/index.js";
import { prisma } from "../prisma.js";
import { IShortUrlRepository } from "./contract/shortUrlRepository.interface.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { IShortUrl } from "@domain/interfaces/shortUrl.interface.js";

export class ShortUrlRepository implements IShortUrlRepository {
  constructor(private repository = prisma.shortUrls) {}

  async create(shortUrl: ShortUrl): Promise<void> {
    const shortUrlData = shortUrl.getProps();
    await this.repository.create({
      data: {
        host: shortUrlData.host,
        path: shortUrlData.path,
        expiresIn: shortUrlData.expiresIn,
        identifier: shortUrlData.identifier,
        protocol: shortUrlData.protocol,
        ...(shortUrlData.userId && {
          user: {
            connect: {
              id: shortUrlData.userId,
            },
          },
        }),
      },
    });

    return;
  }

  async findById(id: string, ignoreDeleted = false): Promise<ShortUrl | null> {
    const shortUrl = await this.repository.findFirst({
      where: {
        id,
        ...(!ignoreDeleted && { deletedAt: null }),
      },
    });

    if (!shortUrl) {
      return null;
    }

    return ShortUrl.transformFromInternalClass(shortUrl as IShortUrl);
  }

  async findByIdentifier(identifier: string): Promise<ShortUrl | null> {
    const shortUrl = await this.repository.findFirst({
      where: {
        identifier,
        deletedAt: null,
      },
    });

    if (!shortUrl) {
      return null;
    }

    return ShortUrl.transformFromInternalClass(shortUrl as IShortUrl);
  }

  async findByUserId(
    userId: string,
    includeAccessShortUrlLog = false
  ): Promise<ShortUrl[]> {
    const shortUrls = await this.repository.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        ...(includeAccessShortUrlLog && { AccessShortUrlLogs: true }),
      },
    });

    const shortUrlsFormatted = shortUrls.map((shortUrl) => {
      return ShortUrl.transformFromInternalClass(shortUrl as IShortUrl);
    });

    return shortUrlsFormatted;
  }

  async update(shortUrl: ShortUrl): Promise<void> {
    const shortUrlData = shortUrl.getProps();
    await this.repository.update({
      where: {
        id: shortUrlData.id!,
      },
      data: {
        host: shortUrlData.host,
        path: shortUrlData.path,
        expiresIn: shortUrlData.expiresIn,
        deletedAt: shortUrlData.deletedAt,
        identifier: shortUrlData.identifier,
        protocol: shortUrlData.protocol,
        ...(shortUrlData.userId && {
          user: {
            connect: {
              id: shortUrlData.userId,
            },
          },
        }),
      },
    });

    return;
  }
}
