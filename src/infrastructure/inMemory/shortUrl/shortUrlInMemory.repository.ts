import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";

export class ShortUrlInMemoryRepository implements IShortUrlRepository {
  constructor(private shortUrls: ShortUrl[] = []) {}

  async create(shortUrl: ShortUrl): Promise<void> {
    const shortUrlData = shortUrl.getProps();
    const id = crypto.randomUUID();
    const longUrl = LongUrlObjValue.create(
      `${shortUrlData.protocol}//${shortUrlData.host}${shortUrlData.path}`
    );

    const shortUrlFinaly = ShortUrl.create(
      id,
      longUrl,
      shortUrlData.expiresIn,
      shortUrlData.userId,
      shortUrlData.identifier
    );

    this.shortUrls.push(shortUrlFinaly);

    return;
  }

  async findById(id: string, ignoreDeleted = false): Promise<ShortUrl | null> {
    const shortUrl = this.shortUrls.find((shortUrl) => {
      if (ignoreDeleted) {
        return shortUrl.getProps().id === id;
      }

      return shortUrl.getProps().id === id && !shortUrl.getProps().deletedAt;
    });

    if (!shortUrl) {
      return null;
    }

    return shortUrl;
  }

  async findByIdentifier(identifier: string): Promise<ShortUrl | null> {
    const shortUrl = this.shortUrls.find(
      (shortUrl) =>
        shortUrl.getProps().identifier.getValue() === identifier &&
        !shortUrl.getProps().deletedAt
    );

    if (!shortUrl) {
      return null;
    }

    return shortUrl;
  }

  async findByUserId(
    userId: string,
    includeAccessShortUrlLog = false
  ): Promise<ShortUrl[]> {
    const shortUrls = this.shortUrls.filter(
      (shortUrl) =>
        shortUrl.getProps().userId === userId && !shortUrl.getProps().deletedAt
    );

    return shortUrls;
  }

  async update(shortUrl: ShortUrl): Promise<void> {
    const shortUrlData = shortUrl.getProps();

    const shortUrlIndex = this.shortUrls.findIndex(
      (shortUrl) => shortUrl.getProps().id === shortUrlData.id
    );

    this.shortUrls[shortUrlIndex] = shortUrl;

    return;
  }
}
