import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { ShortUrlLog } from "@domain/entities/shortUrlLog.entity";
import { IShortUrl } from "@domain/interfaces/shortUrl.interface";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface";
import { describe, expect, test } from "vitest";

describe("ShortUrlLog Entity", () => {
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

    const shortUrlLogClass = ShortUrlLog.create(
      null,
      shortUrlClass.getProps().id!,
      "userId",
      "newValue",
      "oldValue",
      EActionShortUrlLog.UPDATE,
      shortUrlClass
    );

    expect(shortUrlLogClass).toBeDefined();
    expect(shortUrlLogClass).toBeInstanceOf(ShortUrlLog);
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

    const shortUrlLogData = {
      id: "1",
      shortUrlId: shortUrlClass.getProps().id!,
      userId: "userId",
      newValue: "newValue",
      oldValue: "oldValue",
      action: EActionShortUrlLog.UPDATE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const shortUrlLogClass =
      ShortUrlLog.transformFromInternalClass(shortUrlLogData);

    const props = shortUrlLogClass.getProps();
    expect(shortUrlLogClass).toBeDefined();
    expect(shortUrlLogClass).toBeInstanceOf(ShortUrlLog);
    expect(props.id).toBe(shortUrlLogData.id);
    expect(props.shortUrlId).toBe(shortUrlLogData.shortUrlId);
  });
});
