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
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository.js";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

describe("ShortUrlLogRepository", () => {
  let repositoryMock: any;
  let shortUrlLogRepository: ShortUrlLogRepository;
  const spies: MockInstance<(...args: any[]) => any>[] = [];

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      findFirst: vi.fn(),
    };
    shortUrlLogRepository = new ShortUrlLogRepository(repositoryMock);
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
    const shortUrlLog = ShortUrlLog.create(
      null,
      shortUrl!.getProps().id!,
      "userId",
      "newValue",
      "oldValue",
      EActionShortUrlLog.UPDATE,
      shortUrl
    );

    await shortUrlLogRepository.create(shortUrlLog);

    const propsDataBeforeCreate = shortUrlLog.getProps();

    expect(repositoryMock.create).toHaveBeenCalledWith({
      data: {
        updatedAt: propsDataBeforeCreate.updatedAt,
        oldValue: propsDataBeforeCreate.oldValue,
        newValue: propsDataBeforeCreate.newValue,
        action: propsDataBeforeCreate.action,
        user: {
          connect: {
            id: propsDataBeforeCreate.userId,
          },
        },
        shortUrl: {
          connect: {
            id: propsDataBeforeCreate.shortUrlId,
          },
        },
      },
    });
  });
});
