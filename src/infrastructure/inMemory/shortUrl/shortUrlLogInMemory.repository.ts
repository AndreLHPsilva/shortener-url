import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface.js";

export class ShortUrlLogInMemoryRepository implements IShortUrlLogsRepository {
  constructor(private logs: ShortUrlLog[] = []) {}

  async create(shortUrl: ShortUrlLog): Promise<void> {
    const id = crypto.randomUUID();

    const shortUrlLogFinaly = ShortUrlLog.create(
      id,
      shortUrl.getProps().shortUrlId,
      shortUrl.getProps().userId,
      shortUrl.getProps().newValue,
      shortUrl.getProps().oldValue,
      shortUrl.getProps().action,
      shortUrl.getProps().shortUrl!
    );

    this.logs.push(shortUrlLogFinaly);
    return;
  }
}
