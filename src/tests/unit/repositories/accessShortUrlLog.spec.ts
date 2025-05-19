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
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { AccessShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/accessShortUrlLog.repository.js";
import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity.js";
import { IAccessShortUrlLog } from "@domain/interfaces/accessShortUrlLog.interface.js";

describe("AccessShortUrlLog", () => {
  let repositoryMock: any;
  let accessShortUrlLogsRepository: AccessShortUrlLogRepository;
  const spies: MockInstance<(...args: any[]) => any>[] = [];

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      findFirst: vi.fn(),
    };
    accessShortUrlLogsRepository = new AccessShortUrlLogRepository(
      repositoryMock
    );
  });

  afterEach(() => {
    spies.forEach((s) => s.mockRestore());
    spies.length = 0;
  });

  it("should call create with correct data", async () => {
    const accessShortUrlLogData = {
      ip: "ip",
    };

    const shortUrl = ShortUrl.create(
      null,
      LongUrlObjValue.create("https://teste.com.br"),
      null,
      "userId",
      IdentifierObjValue.create()
    );

    const accessShortUrlLog = AccessShortUrlLog.create(
      null,
      accessShortUrlLogData.ip,
      shortUrl
    );

    await accessShortUrlLogsRepository.create(accessShortUrlLog);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      data: {
        ip: accessShortUrlLogData.ip,
        createdAt: accessShortUrlLog.getProps().createdAt,
        updatedAt: accessShortUrlLog.getProps().updatedAt,
        shortUrl: {
          connect: {
            id: shortUrl!.getProps().id!,
          },
        },
      },
    });
  });

  it("should return AccessShortUrlLog instance when findByShortUrlId finds a record", async () => {
    const accessShortUrlLogData: IAccessShortUrlLog = {
      createdAt: new Date(),
      id: "id1",
      shortUrlId: "id1",
      updatedAt: new Date(),
      ShortUrl: null,
      ip: "ip",
    };

    const shortUrl = ShortUrl.create(
      null,
      LongUrlObjValue.create("https://teste.com.br"),
      null,
      "userId",
      IdentifierObjValue.create()
    );

    repositoryMock.findFirst.mockResolvedValue(accessShortUrlLogData);

    const accessShortUrlLog = AccessShortUrlLog.transformFromInternalClass(
      accessShortUrlLogData
    );

    const spy = vi
      .spyOn(ShortUrl, "transformFromInternalClass")
      .mockImplementation(() => shortUrl);
    spies.push(spy);

    const shortUrlId = "id1";
    const includeShortUrl = false;
    const result = await accessShortUrlLogsRepository.findByShortUrlId(
      shortUrlId
    );

    expect(repositoryMock.findFirst).toHaveBeenCalledWith({
      where: {
        shortUrl: {
          id: shortUrlId,
        },
      },
      include: {
        ...(includeShortUrl ? { shortUrl: true } : {}),
      },
    });

    expect(result).toStrictEqual(accessShortUrlLog);
  });

  it("should return null if findByShortUrlId returns null", async () => {
    repositoryMock.findFirst.mockResolvedValue(null);
    const result = await accessShortUrlLogsRepository.findByShortUrlId("id1");
    expect(result).toBe(null);
  });
});
