import { ShortUrl } from "@domain/entities/shortUrl.entity.js";

export interface IShortUrlRepository {
  update: (shortUrl: ShortUrl) => Promise<any>;
  create: (shortUrl: ShortUrl) => Promise<any>;
  findByIdentifier: (identifier: string) => Promise<ShortUrl | null>;
  findById: (id: string) => Promise<ShortUrl | null>;
  findByUserId: (
    userId: string,
    includeAccessShortUrlLog?: boolean
  ) => Promise<ShortUrl[]>;
}
