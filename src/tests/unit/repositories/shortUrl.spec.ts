import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  MockInstance,
  afterEach,
} from "vitest";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";

describe("ShortUrlRepository", () => {
  let repositoryMock: any;
  let shortUrlRepository: ShortUrlRepository;
  const spies: MockInstance<(...args: any[]) => any>[] = [];

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    };
    shortUrlRepository = new ShortUrlRepository(repositoryMock);
  });

  afterEach(() => {
    spies.forEach((s) => s.mockRestore());
    spies.length = 0;
  });

  it("should call create with correct data", async () => {
    const shortUrlData = {
      host: "host.com",
      path: "/abc",
      expiresIn: null,
      protocol: "https:",
      userId: "user-1",
    };

    const longUrl = LongUrlObjValue.create(
      `${shortUrlData.protocol}//${shortUrlData.host}${shortUrlData.path}`
    );
    const identifier = IdentifierObjValue.create();
    const shortUrl = ShortUrl.create(
      null,
      longUrl,
      shortUrlData.expiresIn,
      shortUrlData.userId,
      identifier
    );

    await shortUrlRepository.create(shortUrl);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      data: {
        host: shortUrlData.host,
        path: shortUrlData.path,
        expiresIn: shortUrlData.expiresIn,
        identifier: identifier.getValue(),
        protocol: shortUrlData.protocol,
        user: {
          connect: { id: shortUrlData.userId },
        },
      },
    });
  });

  it("should return null if findById returns null", async () => {
    repositoryMock.findFirst.mockResolvedValue(null);
    const result = await shortUrlRepository.findById("any-id");
    expect(result).toBeNull();
  });

  it("should return ShortUrl instance when findById finds a record", async () => {
    const dbResponse = {
      id: "id1",
      host: "host.com",
      path: "/abc",
      expiresIn: null,
      identifier: "123456",
      protocol: "https:",
      deletedAt: null,
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.findFirst.mockResolvedValue(dbResponse);

    const shortUrl = ShortUrl.transformFromInternalClass(dbResponse);

    const spy = vi
      .spyOn(ShortUrl, "transformFromInternalClass")
      .mockImplementation(() => shortUrl);
    spies.push(spy);

    const result = await shortUrlRepository.findById("id1");

    expect(repositoryMock.findFirst).toHaveBeenCalledWith({
      where: {
        id: "id1",
        deletedAt: null,
      },
    });
    expect(result).toBe(shortUrl);
  });

  it("should return null if findByIdentifier returns null", async () => {
    repositoryMock.findFirst.mockResolvedValue(null);
    const result = await shortUrlRepository.findByIdentifier("123456");
    expect(result).toBeNull();
  });

  it("should return ShortUrl instance when findByIdentifier finds a record", async () => {
    const dbResponse = {
      id: "id1",
      host: "host.com",
      path: "/abc",
      expiresIn: null,
      identifier: "123456",
      protocol: "https:",
      deletedAt: null,
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.findFirst.mockResolvedValue(dbResponse);

    const shortUrl = ShortUrl.transformFromInternalClass(dbResponse);

    const spy = vi
      .spyOn(ShortUrl, "transformFromInternalClass")
      .mockImplementation(() => shortUrl);
    spies.push(spy);

    const result = await shortUrlRepository.findByIdentifier(
      dbResponse.identifier
    );

    expect(repositoryMock.findFirst).toHaveBeenCalledWith({
      where: {
        identifier: dbResponse.identifier,
        deletedAt: null,
      },
    });
    expect(result).toBe(shortUrl);
  });

  it("should return null if findByUserId returns array empty", async () => {
    repositoryMock.findMany.mockResolvedValue([]);
    const result = await shortUrlRepository.findByUserId("user-id");
    expect(result).toEqual([]);
  });

  it("should return ShortUrl instance when findByUserId finds a record", async () => {
    const dbResponse = [
      {
        id: "id1",
        host: "host.com",
        path: "/abc",
        expiresIn: null,
        identifier: "123456",
        protocol: "https:",
        deletedAt: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repositoryMock.findMany.mockResolvedValue(dbResponse);

    const shortUrl = ShortUrl.transformFromInternalClass(dbResponse[0]);

    const spy = vi
      .spyOn(ShortUrl, "transformFromInternalClass")
      .mockImplementation(() => shortUrl);
    spies.push(spy);
    const result = await shortUrlRepository.findByUserId(dbResponse[0].userId);

    expect(repositoryMock.findMany).toHaveBeenCalledWith({
      where: {
        userId: dbResponse[0].userId,
        deletedAt: null,
      },
      include: {},
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(shortUrl);
  });

  it("should return ShortUrl instance when findByUserId finds a record and include AccessShortUrlLogs", async () => {
    const dbResponse = [
      {
        id: "id1",
        host: "host.com",
        path: "/abc",
        expiresIn: null,
        identifier: "123456",
        protocol: "https:",
        deletedAt: null,
        userId: "user-1",
        AccessShortUrlLogs: [
          {
            id: "id1",
            ip: "127.0.0.1",
            shortUrlId: "id1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repositoryMock.findMany.mockResolvedValue(dbResponse);

    const shortUrl = ShortUrl.transformFromInternalClass(dbResponse[0]);

    const spy = vi
      .spyOn(ShortUrl, "transformFromInternalClass")
      .mockImplementation(() => shortUrl);
    spies.push(spy);

    const result = await shortUrlRepository.findByUserId(
      dbResponse[0].userId,
      true
    );

    expect(repositoryMock.findMany).toHaveBeenCalledWith({
      where: {
        userId: dbResponse[0].userId,
        deletedAt: null,
      },
      include: {
        AccessShortUrlLogs: true,
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(shortUrl);
    const resultData = result[0].getProps();
    expect(resultData.sumAccess).toBe(1);
  });
  it("should call update with correct data", async () => {
    const shortUrlData = {
      id: "id1",
      host: "host.com",
      path: "/abc",
      expiresIn: null,
      identifier: "123456",
      protocol: "https:",
      deletedAt: null,
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const shortUrl = ShortUrl.transformFromInternalClass(shortUrlData);

    await shortUrlRepository.update(shortUrl);

    expect(repositoryMock.update).toHaveBeenCalledWith({
      where: {
        id: shortUrlData.id,
      },
      data: {
        host: shortUrlData.host,
        path: shortUrlData.path,
        expiresIn: shortUrlData.expiresIn,
        deletedAt: shortUrlData.deletedAt,
        identifier: shortUrlData.identifier,
        protocol: shortUrlData.protocol,
        user: {
          connect: {
            id: shortUrlData.userId,
          },
        },
      },
    });
  });
});
