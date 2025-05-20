import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { IShortUrl } from "@domain/interfaces/shortUrl.interface";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue";
import { ShortUrlAlreadyDeletedError } from "@shared/errors/ShortUrlAlreadyDeletedError";
import { toSpISOString } from "@shared/utils/date/index";
import { describe, expect, test } from "vitest";

describe("ShortUrl Entity", () => {
  test("should create new instance", () => {
    const longUrl = LongUrlObjValue.create("https://teste.com.br");
    const identifier = IdentifierObjValue.create();
    const shortUrl = ShortUrl.create(null, longUrl, null, null, identifier);
    const longUrlProps = longUrl.getProps();
    const props = shortUrl.getProps();

    expect(shortUrl).toBeDefined();
    expect(shortUrl).toBeInstanceOf(ShortUrl);
    expect(props.identifier).toBe(identifier);
    expect(props.identifier.getValue()).toBe(identifier.getValue());
    expect(props.host).toBe(longUrlProps.host);
    expect(props.path).toBe(longUrlProps.path);
    expect(props.protocol).toBe(longUrlProps.protocol);
  });

  test("should be transform data to class", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    expect(shortUrl).toBeDefined();
    expect(shortUrl).toBeInstanceOf(ShortUrl);

    const props = shortUrl.getProps();
    expect(props.id).toBe(shortUrlData.id);
    expect(props.identifier.getValue()).toBe(shortUrlData.identifier);
    expect(props.host).toBe(shortUrlData.host);
    expect(props.path).toBe(shortUrlData.path);
    expect(props.protocol).toBe(shortUrlData.protocol);
    expect(props.createdAt).toBe(toSpISOString(shortUrlData.createdAt));
    expect(props.updatedAt).toBe(toSpISOString(shortUrlData.updatedAt));
  });

  test("should be change short url for deleted", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    shortUrl.delete();

    expect(shortUrl.getProps().deletedAt).not.toBeNull();
  });

  test("should return links", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    const { links } = shortUrl.gerenateLinks();
    const props = shortUrl.getProps();
    const routePath = shortUrl.getRoutePath();

    expect(links).toHaveLength(2);
    expect(links[0].rel).toBe("update");
    expect(links[0].method).toBe("PUT");
    expect(links[0].href).toBe(`${routePath}/${props.id}`);
    expect(links[1].rel).toBe("delete");
    expect(links[1].method).toBe("DELETE");
    expect(links[1].href).toBe(`${routePath}/${props.id}`);
  });

  test("should return long url", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    const longUrl = shortUrl.getUrl();

    expect(longUrl).toBe(
      `${shortUrlData.protocol}//${shortUrlData.host}${shortUrlData.path}`
    );
  });

  test("should return short url", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    const urlShort = shortUrl.getShortUrl();
    const identifier = shortUrlData.identifier;

    expect(urlShort).toBe(`${process.env.BASE_URL}/${identifier}`);
  });

  test("should return error short url already deleted", () => {
    const shortUrlData: IShortUrl = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      expiresIn: null,
      host: "teste.com.br",
      id: "1",
      identifier: "123456",
      path: "/",
      protocol: "https:",
      userId: null,
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    shortUrl.delete();

    expect(() => {
      shortUrl.delete();
    }).toThrow(ShortUrlAlreadyDeletedError);
  });
});
