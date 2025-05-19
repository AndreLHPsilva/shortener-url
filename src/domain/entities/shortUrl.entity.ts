import { IShortUrl } from "@domain/interfaces/shortUrl.interface.js";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { toSpISOString } from "@shared/utils/date/index.js";
import { AccessShortUrlLog } from "./accessShortUrlLog.entity.js";
import { ShortUrlAlreadyDeletedError } from "@shared/errors/ShortUrlAlreadyDeletedError.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";

export class ShortUrl {
  private accessShortUrlLogs: AccessShortUrlLog[] = [];
  private routePath = "/short-urls";
  constructor(
    private id: string | null = null,
    private host: string,
    private expiresIn: string | null = null,
    private deletedAt: string | null = null,
    private userId: string | null = null,
    private createdAt: string,
    private updatedAt: string,
    private identifier: IdentifierObjValue,
    private path: string = "/",
    private protocol: string,
    accessShortUrlLog: AccessShortUrlLog[] = []
  ) {
    this.expiresIn = expiresIn ? toSpISOString(new Date(expiresIn)) : null;
    this.setAccessShortUrlLogs(accessShortUrlLog);
  }

  static transformFromInternalClass(shortUrl: IShortUrl): ShortUrl {
    const deletedAt = shortUrl.deletedAt
      ? toSpISOString(shortUrl.deletedAt)
      : null;

    const expiresIn = shortUrl.expiresIn
      ? toSpISOString(shortUrl.expiresIn)
      : null;

    const accessShortUrlLogs =
      shortUrl.AccessShortUrlLogs?.map((accessShortUrlLog) =>
        AccessShortUrlLog.transformFromInternalClass(accessShortUrlLog)
      ) ?? [];

    const identifier = new IdentifierObjValue(shortUrl.identifier);

    return new ShortUrl(
      shortUrl.id,
      shortUrl.host,
      expiresIn,
      deletedAt,
      shortUrl.userId,
      toSpISOString(shortUrl.createdAt),
      toSpISOString(shortUrl.updatedAt),
      identifier,
      shortUrl.path,
      shortUrl.protocol,
      accessShortUrlLogs
    );
  }
  static create(
    id: string | null,
    longUrl: LongUrlObjValue,
    expiresIn: string | null,
    userId: string | null,
    identifier: IdentifierObjValue
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

  getRoutePath() {
    return this.routePath;
  }
  delete() {
    if (this.deletedAt) {
      throw new ShortUrlAlreadyDeletedError();
    }

    this.deletedAt = toSpISOString();
  }

  gerenateLinks() {
    return {
      links: [
        {
          rel: "update",
          method: "PUT",
          href: `${this.routePath}/${this.id}`,
        },
        {
          rel: "delete",
          method: "DELETE",
          href: `${this.routePath}/${this.id}`,
        },
      ],
    };
  }

  setAccessShortUrlLogs(accessShortUrlLogs: AccessShortUrlLog[]) {
    this.accessShortUrlLogs = accessShortUrlLogs;
  }

  setHost(host: string) {
    this.host = host;
  }

  getUrl() {
    return `${this.protocol}//${this.host}${this.path}`;
  }

  getShortUrl() {
    return `${process.env.BASE_URL}/${this.identifier.getValue()}`;
  }

  getProps() {
    const sumAccess = this.accessShortUrlLogs.length;

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
      sumAccess,
    };
  }
}
