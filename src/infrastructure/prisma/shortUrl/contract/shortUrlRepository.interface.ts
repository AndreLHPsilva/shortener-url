import { ShortUrl } from "@domain/entities/shortUrl.entity.js";

export interface IShortUrlRepository {
  create: (user: ShortUrl) => Promise<any>;
  findByIdentifier: (identifier: string) => Promise<ShortUrl | null>;
  findById: (id: string) => Promise<ShortUrl | null>;
  findByUserId: (userId: string) => Promise<ShortUrl | null>;
}
