import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { CreateUserUseCase } from "@application/use-cases/user/create/create.usecase.js";
import { IUserRepository } from "@infrastructure/prisma/user/contract/userRepository.interface.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { CreateShortUrlController } from "@presentation/http/controllers/shortUrl/create/create.controller.js";
import { CreateShortUrlUseCase } from "@application/use-cases/shortUrl/create/create.usecase.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "src/app.js";
import { ICreateUserUseCaseProps } from "@application/use-cases/user/create/types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import {
  ISigninResponseUseCase,
  ISigninUseCaseProps,
} from "@application/use-cases/auth/signin/types.js";
import { SigninUseCase } from "@application/use-cases/auth/signin/signin.usecase.js";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory.js";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory.js";
import { IUserJwt } from "@shared/types/types.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { toSpISOString } from "@shared/utils/date/index.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { FailedGenerateIdentifierError } from "@shared/errors/FailedGenerateIdentifierError.js";

describe("Create short url route", () => {
  let userRepository: IUserRepository;
  let useCaseSignin: UseCase<ISigninUseCaseProps, ISigninResponseUseCase>;
  let useCaseCreateUser: UseCase<ICreateUserUseCaseProps, void>;
  let controllerCreateShortUrl: CreateShortUrlController;
  let useCaseCreateShortUrl: CreateShortUrlUseCase;
  let shortUrlRepository: IShortUrlRepository;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    userRepository = userRepositoryFactory();
    useCaseSignin = new SigninUseCase(userRepository);
    useCaseCreateUser = new CreateUserUseCase(userRepository);
    shortUrlRepository = shortUrlRepositoryFactory();
    useCaseCreateShortUrl = new CreateShortUrlUseCase(shortUrlRepository);
    controllerCreateShortUrl = new CreateShortUrlController(
      useCaseCreateShortUrl
    );
  });

  test("should create short url", async () => {
    const email = `${crypto.randomUUID()}@example.com`;
    const payloadUser = {
      name: "John Doe",
      email,
      password: "securepass",
    };
    await useCaseCreateUser.execute(payloadUser);
    const responseAuth = await useCaseSignin.execute({
      email,
      password: payloadUser.password,
    });
    const { token } = responseAuth;
    const user = app.jwt.decode(token) as IUserJwt;

    const payload = {
      longUrl: "http://localhost:3000/testes?test=true",
      expiresIn: null,
    };

    const request = {
      body: payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
      user,
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    const response = await controllerCreateShortUrl.handle(request, reply);

    expect(response).toEqual(
      expect.objectContaining({
        shortUrl: expect.any(String),
      })
    );

    const shortUrls = await shortUrlRepository.findByUserId(user.id);

    expect(shortUrls).toHaveLength(1);

    const shortUrl = shortUrls[0];
    const props = shortUrl.getProps();

    expect(shortUrl).toBeInstanceOf(Object);
    expect(shortUrl?.getUrl()).toBe(payload.longUrl);
    expect(props?.expiresIn).toBe(payload.expiresIn);
    expect(props?.userId).toBe(user.id);
  });

  test("should throw FailedGenerateIdentifierError if unable to generate unique identifier", async () => {
    const shortUrlId = crypto.randomUUID();
    const identifier = new IdentifierObjValue("123456");
    const shortUrl = new ShortUrl(
      shortUrlId,
      "localhost:3000",
      null,
      null,
      "userId",
      toSpISOString(),
      toSpISOString(),
      identifier,
      "/teste",
      "http:"
    );

    vi.spyOn(shortUrlRepository, "findByIdentifier").mockResolvedValue(
      shortUrl
    );

    IdentifierObjValue.maxAttemptsGenerateUniqueIdentifier = 1;
    IdentifierObjValue.timeoutGenerateUniqueIdentifierMs = 50;

    const payload = {
      longUrl: "http://localhost:3000/fail-test",
      expiresIn: null,
      userId: "user-id-test",
    };

    await expect(useCaseCreateShortUrl.execute(payload)).rejects.toThrowError(
      FailedGenerateIdentifierError
    );
  });
});
