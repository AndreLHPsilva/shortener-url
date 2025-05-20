import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "src/app";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory";
import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { toSpISOString } from "@shared/utils/date/index";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue";
import { RedirectShortUrlController } from "@presentation/http/controllers/shortUrl/redirect/redirect.controller";
import { RedirectShortUrlUseCase } from "@application/use-cases/shortUrl/redirect/redirect.usecase";
import { ContabilizeAccessToUrlUseCase } from "@application/use-cases/shortUrl/contabilizeAccessToUrl/contabilizeAccessToUrl.usecase";
import { accessShortUrlRepositoryFactory } from "@infrastructure/factory/accessShortUrlRepository.factory";
import { IAccessShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/accessShortUrlLogsRepository.interface";
import { ShortUrlExpired } from "@shared/errors/ShortUrlExpired";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";

describe.only("Redirect short url route", () => {
  let shortUrlRepository: IShortUrlRepository;
  let accessShortUrlRepository: IAccessShortUrlLogsRepository;
  let contabilizeAccessToUrlUseCase: ContabilizeAccessToUrlUseCase;
  let redirectShortUrlUseCase: RedirectShortUrlUseCase;
  let redirectShortUrlController: RedirectShortUrlController;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    shortUrlRepository = shortUrlRepositoryFactory();
    accessShortUrlRepository = accessShortUrlRepositoryFactory();
    contabilizeAccessToUrlUseCase = new ContabilizeAccessToUrlUseCase(
      accessShortUrlRepository,
      shortUrlRepository
    );
    redirectShortUrlUseCase = new RedirectShortUrlUseCase(
      shortUrlRepository,
      contabilizeAccessToUrlUseCase
    );
    redirectShortUrlController = new RedirectShortUrlController(
      redirectShortUrlUseCase
    );
  });

  test("should redirect short url", async () => {
    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: null,
    };

    const longUrl = LongUrlObjValue.create(payload.longUrl);
    const identifier = IdentifierObjValue.create();
    const shortUrl = ShortUrl.create(
      null,
      longUrl,
      payload.expiresIn,
      null,
      identifier
    );

    shortUrlRepository.create(shortUrl);

    const request = {
      params: { identifierShortUrl: identifier.getValue() },
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      redirect: vi.fn((data) => {
        return data;
      }),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    const response = await redirectShortUrlController.handle(request, reply);

    expect(response).toBe(payload.longUrl);
  });

  test("should return error when redirect short url expired", async () => {
    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: toSpISOString(new Date(Date.now() - 1000)),
    };

    const longUrl = LongUrlObjValue.create(payload.longUrl);
    const identifier = IdentifierObjValue.create();
    const shortUrl = ShortUrl.create(
      null,
      longUrl,
      payload.expiresIn,
      null,
      identifier
    );

    shortUrlRepository.create(shortUrl);

    const request = {
      params: { identifierShortUrl: identifier.getValue() },
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    await expect(
      redirectShortUrlController.handle(request, reply)
    ).rejects.toThrowError(ShortUrlExpired);
  });

  test("should return error not fouded short url", async () => {
    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: toSpISOString(new Date(Date.now() - 1000)),
    };

    const longUrl = LongUrlObjValue.create(payload.longUrl);
    const identifier = IdentifierObjValue.create();
    const shortUrl = ShortUrl.create(
      null,
      longUrl,
      payload.expiresIn,
      null,
      identifier
    );

    shortUrlRepository.create(shortUrl);

    const request = {
      params: { identifierShortUrl: "notexi" },
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    await expect(
      redirectShortUrlController.handle(request, reply)
    ).rejects.toThrowError(ShortUrlNotFoundedError);
  });
});
