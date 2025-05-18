import { toSpISOString } from "@shared/utils/date/index.js";
import { ShortUrl } from "./shortUrl.entity.js";
import { IShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

export class ShortUrlLog {
  constructor(
    private id: string | null = null,
    private shortUrlId: string,
    private userId: string,
    private updatedAt: string,
    private newValue: string,
    private oldValue: string,
    private shortUrl: ShortUrl | null
  ) {}

  static create(
    id: string | null,
    shortUrlId: string,
    userId: string,
    newValue: string,
    oldValue: string,
    shortUrl: ShortUrl
  ) {
    const date = toSpISOString();
    return new ShortUrlLog(
      id,
      shortUrlId,
      userId,
      date,
      newValue,
      oldValue,
      shortUrl
    );
  }

  static transformFromInternalClass(accessShortUrlLog: IShortUrlLog) {
    const shortUrl = accessShortUrlLog.ShortUrl
      ? ShortUrl.transformFromInternalClass(accessShortUrlLog.ShortUrl)
      : null;

    return new ShortUrlLog(
      accessShortUrlLog.id,
      accessShortUrlLog.shortUrlId,
      accessShortUrlLog.userId,
      toSpISOString(accessShortUrlLog.updatedAt),
      accessShortUrlLog.newValue,
      accessShortUrlLog.oldValue,
      shortUrl
    );
  }

  setNewValue(newValue: string) {
    this.newValue = newValue;
  }

  setOldValue(oldValue: string) {
    this.oldValue = oldValue;
  }

  getProps() {
    return {
      id: this.id,
      shortUrlId: this.shortUrlId,
      userId: this.userId,
      newValue: this.newValue,
      oldValue: this.oldValue,
      shortUrl: this.shortUrl,
      updatedAt: this.updatedAt,
    };
  }
}
