import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";
import { IAccessShortUrlLog } from "@domain/interfaces/accessShortUrlLog.interface.js";
import { IShortUrl } from "@domain/interfaces/shortUrl.interface.js";
import { describe, expect, test } from "vitest";

describe("AccessShortUrlLog Entity", () => {
  test("should created new instance", () => {
    const shortUrl: IShortUrl = {
      id: "1",
      host: "host",
      path: "path",
      protocol: "protocol",
      identifier: "123465",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      userId: null,
    };

    const shortUrlClass = ShortUrl.transformFromInternalClass(shortUrl);

    const accessShortUrlLog = AccessShortUrlLog.create(
      null,
      "127.0.0.1",
      shortUrlClass
    );

    expect(accessShortUrlLog).toBeDefined();
    expect(accessShortUrlLog).toBeInstanceOf(AccessShortUrlLog);
  });

  test("should transform data to new instance", () => {
    const shortUrl: IShortUrl = {
      id: "1",
      host: "host",
      path: "path",
      protocol: "protocol",
      identifier: "123465",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      userId: null,
    };

    const shortUrlClass = ShortUrl.transformFromInternalClass(shortUrl);

    const accessShortUrlLog: IAccessShortUrlLog = {
      id: "1",
      shortUrlId: shortUrlClass.getProps().id!,
      ip: "127.0.0.1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const accessShortUrlLogClass =
      AccessShortUrlLog.transformFromInternalClass(accessShortUrlLog);

    const props = accessShortUrlLogClass.getProps();
    expect(accessShortUrlLogClass).toBeDefined();
    expect(accessShortUrlLogClass).toBeInstanceOf(AccessShortUrlLog);
    expect(props.id).toBe(accessShortUrlLog.id);
    expect(props.shortUrlId).toBe(accessShortUrlLog.shortUrlId);
  });
});
