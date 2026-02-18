import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  MockInstance,
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
import { IAccessShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/accessShortUrlLogsRepository.interface";
import { ShortUrlExpired } from "@shared/errors/ShortUrlExpired";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { IIdGenerator } from "@application/ports/types";
import { convertToBase } from "@shared/utils/convert";
import { accessShortUrlRepositoryFactory } from "@infrastructure/factory/accessShortUrlRepository.factory";

const mockIdGenerator: IIdGenerator = {
  nextId: vi.fn(() => 1234567890123456789n),
};

vi.mock("@shared/utils/convert", () => ({
  convertToBase: vi.fn((id: bigint) => {
    const base62Chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    let tempId = id;
    for (let i = 0; i < 8; i++) {
      result = base62Chars[Number(tempId % 62n)] + result;
      tempId /= 62n;
    }
    return result.padStart(8, '0').slice(-8);
  }),
}));

describe.only("Redirect short url route", () => {
  let shortUrlRepository: IShortUrlRepository;
  let accessShortUrlRepository: IAccessShortUrlLogsRepository;
  let contabilizeAccessToUrlUseCase: ContabilizeAccessToUrlUseCase;
  let redirectShortUrlUseCase: RedirectShortUrlUseCase;
  let redirectShortUrlController: RedirectShortUrlController;

  let spyOnShortUrlRepositoryFindByIdentifier: MockInstance;
  let spyOnContabilizeAccessToUrlUseCaseExecute: MockInstance;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    shortUrlRepository = shortUrlRepositoryFactory();
    accessShortUrlRepository = accessShortUrlRepositoryFactory();

    const MockContabilizeAccessToUrlUseCase = vi.fn(() => ({
      execute: vi.fn(),
    }));
    contabilizeAccessToUrlUseCase = new MockContabilizeAccessToUrlUseCase() as unknown as ContabilizeAccessToUrlUseCase;

    spyOnContabilizeAccessToUrlUseCaseExecute = contabilizeAccessToUrlUseCase.execute as unknown as MockInstance;


    redirectShortUrlUseCase = new RedirectShortUrlUseCase(
      shortUrlRepository,
      contabilizeAccessToUrlUseCase
    );
    redirectShortUrlController = new RedirectShortUrlController(
      redirectShortUrlUseCase
    );

    spyOnShortUrlRepositoryFindByIdentifier = vi.spyOn(shortUrlRepository, 'findByIdentifier');
  });

  test("should redirect short url", async () => {
    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: null,
    };

    const longUrl = LongUrlObjValue.create(payload.longUrl);

    (mockIdGenerator.nextId as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      111222333444555666n
    );
    (vi.mocked(convertToBase) as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      "redirect"
    );

    const identifier = IdentifierObjValue.create(mockIdGenerator);
    const shortUrl = ShortUrl.create(
      "some-short-url-id",
      longUrl,
      payload.expiresIn,
      null,
      identifier
    );

    vi.spyOn(shortUrlRepository, 'create').mockResolvedValueOnce(shortUrl);
    spyOnShortUrlRepositoryFindByIdentifier.mockResolvedValueOnce(shortUrl);
    spyOnContabilizeAccessToUrlUseCaseExecute.mockResolvedValueOnce(undefined);


    await shortUrlRepository.create(shortUrl);

    const request = {
      params: { identifierShortUrl: identifier.getValue() },
      ip: "127.0.0.1",
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      redirect: vi.fn((data, statusCode = 302) => {
        return data;
      }),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    const response = await redirectShortUrlController.handle(request, reply);

    expect(response).toBe(payload.longUrl);
    expect(reply.redirect).toHaveBeenCalledWith(payload.longUrl, 302);
    expect(spyOnShortUrlRepositoryFindByIdentifier).toHaveBeenCalledWith(identifier.getValue());
    expect(spyOnContabilizeAccessToUrlUseCaseExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        shortUrlId: shortUrl.getProps().id,
        ip: request.ip,
      })
    );
  });

  test("should return error when redirect short url expired", async () => {
    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: toSpISOString(new Date(Date.now() - 1000)),
    };

    const longUrl = LongUrlObjValue.create(payload.longUrl);

    (mockIdGenerator.nextId as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      222333444555666777n
    );
    (vi.mocked(convertToBase) as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      "expired"
    );

    const identifier = IdentifierObjValue.create(mockIdGenerator);
    const shortUrl = ShortUrl.create(
      "some-expired-id",
      longUrl,
      payload.expiresIn,
      null,
      identifier
    );

    spyOnShortUrlRepositoryFindByIdentifier.mockResolvedValueOnce(shortUrl);

    const request = {
      params: { identifierShortUrl: identifier.getValue() },
      ip: "127.0.0.1",
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

    expect(spyOnShortUrlRepositoryFindByIdentifier).toHaveBeenCalledWith(identifier.getValue());
    expect(spyOnContabilizeAccessToUrlUseCaseExecute).not.toHaveBeenCalled();
  });

  test("should return error not fouded short url", async () => {
    spyOnShortUrlRepositoryFindByIdentifier.mockResolvedValueOnce(null);

    const request = {
      params: { identifierShortUrl: "notfound" },
      ip: "127.0.0.1",
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

    expect(spyOnShortUrlRepositoryFindByIdentifier).toHaveBeenCalledWith("notfound");
    expect(spyOnContabilizeAccessToUrlUseCaseExecute).not.toHaveBeenCalled();
  });
});
