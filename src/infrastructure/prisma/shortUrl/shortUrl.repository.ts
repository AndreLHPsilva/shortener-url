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

  async findById(id: string): Promise<ShortUrl | null> {
    const shortUrl = await this.repository.findFirst({
      where: {
        id,
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
      },
    });

    if (!shortUrl) {
      return null;
    }

    return ShortUrl.transformFromInternalClass(shortUrl as IShortUrl);
  }

  async findByUserId(userId: string): Promise<ShortUrl | null> {
    const shortUrl = await this.repository.findFirst({
      where: {
        userId,
      },
    });

    if (!shortUrl) {
      return null;
    }

    return ShortUrl.transformFromInternalClass(shortUrl as IShortUrl);
  }
}
