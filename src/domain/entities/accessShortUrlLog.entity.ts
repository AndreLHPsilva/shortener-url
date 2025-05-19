import { toSpISOString } from "@shared/utils/date/index.js";
import { ShortUrl } from "./shortUrl.entity.js";
import { IAccessShortUrlLog } from "@domain/interfaces/accessShortUrlLog.interface.js";

export class AccessShortUrlLog {
  constructor(
    private id: string | null = null,
    private ip: string,
    private createdAt: string,
    private updatedAt: string,
    private shortUrlId: string,
    private ShortUrl: ShortUrl | null
  ) {}

  static create(id: string | null, ip: string, shortUrl: ShortUrl) {
    const date = toSpISOString();
    return new AccessShortUrlLog(
      id,
      ip,
      date,
      date,
      shortUrl.getProps().id!,
      shortUrl
    );
  }

  static transformFromInternalClass(accessShortUrlLog: IAccessShortUrlLog) {
    const shortUrl = accessShortUrlLog.ShortUrl
      ? ShortUrl.transformFromInternalClass(accessShortUrlLog.ShortUrl)
      : null;

    return new AccessShortUrlLog(
      accessShortUrlLog.id,
      accessShortUrlLog.ip,
      toSpISOString(accessShortUrlLog.createdAt),
      toSpISOString(accessShortUrlLog.updatedAt),
      accessShortUrlLog.shortUrlId,
      shortUrl
    );
  }
  getProps() {
    return {
      id: this.id,
      ip: this.ip,
      shortUrlId: this.shortUrlId,
      shortUrl: this.ShortUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
