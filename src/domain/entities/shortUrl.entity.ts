import { IShortUrl } from "@domain/interfaces/shortUrl.interface.js";
import { LongUrlObjValue } from "@domain/valueObjects/longUrl.objValue.js";
import { toSpISOString } from "@shared/utils/date/index.js";

export class ShortUrl {
  constructor(
    private id: string | null = null,
    private host: string,
    private expiresIn: string | null = null,
    private deletedAt: string | null = null,
    private userId: string | null = null,
    private createdAt: string,
    private updatedAt: string,
    private identifier: string,
    private path: string = "/",
    private protocol: string
  ) {
    this.expiresIn = expiresIn ? toSpISOString(new Date(expiresIn)) : null;
  }

  static transformFromInternalClass(shortUrl: IShortUrl): ShortUrl {
    const deletedAt = shortUrl.deletedAt
      ? toSpISOString(shortUrl.deletedAt)
      : null;

    const expiresIn = shortUrl.expiresIn
      ? toSpISOString(shortUrl.expiresIn)
      : null;

    return new ShortUrl(
      shortUrl.id,
      shortUrl.host,
      expiresIn,
      deletedAt,
      shortUrl.userId,
      toSpISOString(shortUrl.createdAt),
      toSpISOString(shortUrl.updatedAt),
      shortUrl.identifier,
      shortUrl.path,
      shortUrl.protocol
    );
  }
  static create(
    id: string | null,
    longUrl: LongUrlObjValue,
    expiresIn: string | null,
    userId: string | null,
    identifier: string
  ) {
    const date = toSpISOString();

    return new ShortUrl(
      id,
      longUrl.getProps().host,
      expiresIn,
      null,
      userId,
      date,
      date,
      identifier,
      longUrl.getProps().path,
      longUrl.getProps().protocol
    );
  }

  getUrl() {
    return `${this.protocol}//${this.host}${this.path}`;
  }

  getProps() {
    return {
      id: this.id,
      host: this.host,
      expiresIn: this.expiresIn,
      deletedAt: this.deletedAt,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      identifier: this.identifier,
      path: this.path,
      protocol: this.protocol,
    };
  }
}
