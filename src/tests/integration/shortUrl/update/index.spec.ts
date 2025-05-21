import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { CreateUserUseCase } from "@application/use-cases/user/create/create.usecase";
import { IUserRepository } from "@domain/interfaces/userRepository.interface";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "src/app";
import { ICreateUserUseCaseProps } from "@application/use-cases/user/create/types";
import { UseCase } from "@application/use-cases/contract/useCase";
import {
  ISigninResponseUseCase,
  ISigninUseCaseProps,
} from "@application/use-cases/auth/signin/types";
import { SigninUseCase } from "@application/use-cases/auth/signin/signin.usecase";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory";
import { IUserJwt } from "@shared/types/types";
import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { toSpISOString } from "@shared/utils/date/index";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";
import { CreateLogWhenUpdateUseCase } from "@application/use-cases/shortUrl/createLogWhenUpdate/createLogWhenUpdate.usecase";
import { shortUrlLogRepositoryFactory } from "@infrastructure/factory/shortUrlLogRepository.factory";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { UpdateShortUrlUseCase } from "@application/use-cases/shortUrl/update/update.usecase";
import { UpdateShortUrlController } from "@presentation/http/controllers/shortUrl/update/update.controller";

describe("Update short url route", () => {
  let userRepository: IUserRepository;
  let useCaseSignin: UseCase<ISigninUseCaseProps, ISigninResponseUseCase>;
  let useCaseCreateUser: UseCase<ICreateUserUseCaseProps, void>;
  let shortUrlRepository: IShortUrlRepository;
  let shortUrlLogsRepository: IShortUrlLogsRepository;
  let createLogWhenUpdateUseCase: CreateLogWhenUpdateUseCase;
  let updateShortUrlUseCase: UpdateShortUrlUseCase;
  let updateShortUrlController: UpdateShortUrlController;

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
    shortUrlLogsRepository = shortUrlLogRepositoryFactory();
    createLogWhenUpdateUseCase = new CreateLogWhenUpdateUseCase(
      shortUrlLogsRepository,
      shortUrlRepository
    );
    updateShortUrlUseCase = new UpdateShortUrlUseCase(
      shortUrlRepository,
      createLogWhenUpdateUseCase
    );
    updateShortUrlController = new UpdateShortUrlController(
      updateShortUrlUseCase
    );
  });

  test("should update short url", async () => {
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

    const identifier = new IdentifierObjValue("123456");
    const oldHost = "localhost:3000";
    const shortUrl = new ShortUrl(
      null,
      oldHost,
      null,
      null,
      user.id,
      toSpISOString(),
      toSpISOString(),
      identifier,
      "/teste",
      "http:"
    );

    shortUrlRepository.create(shortUrl);

    const [shortUrlsBeforeUpdate] = await shortUrlRepository.findByUserId(
      user.id
    );

    const newUrl = "http://localhost:4200/second-url";

    const request = {
      params: {
        shortUrlId: shortUrlsBeforeUpdate.getProps().id,
      },
      body: {
        newUrl,
      },
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

    const response = await updateShortUrlController.handle(request, reply);

    expect(response).toBeNull();

    const [shortUrlsAfterUpdate] = await shortUrlRepository.findByUserId(
      user.id
    );

    expect(shortUrlsAfterUpdate.getUrl()).not.toEqual(
      shortUrl.getUrl()
    );
    expect(shortUrlsAfterUpdate.getUrl()).toEqual(newUrl);
  });

  test("should throw ShortUrlNotFoundedError if not founded short url", async () => {
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

    const request = {
      params: {
        shortUrlId: "id-not-exists",
      },
      body: {
        newUrl: "http://localhost:4200",
      },
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

    await expect(
      updateShortUrlController.handle(request, reply)
    ).rejects.toThrowError(ShortUrlNotFoundedError);
  });
});
