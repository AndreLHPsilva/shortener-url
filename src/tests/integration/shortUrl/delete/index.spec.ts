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
import { DeleteShortUrlController } from "@presentation/http/controllers/shortUrl/delete/delete.controller.js";
import { DeleteShortUrlUseCase } from "@application/use-cases/shortUrl/delete/delete.usecase.js";
import { CreateLogWhenUpdateUseCase } from "@application/use-cases/shortUrl/createLogWhenUpdate/createLogWhenUpdate.usecase.js";
import { shortUrlLogRepositoryFactory } from "@infrastructure/factory/shortUrlLogRepository.factory.js";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";

describe("Delete short url route", () => {
  let userRepository: IUserRepository;
  let useCaseSignin: UseCase<ISigninUseCaseProps, ISigninResponseUseCase>;
  let useCaseCreateUser: UseCase<ICreateUserUseCaseProps, void>;
  let shortUrlRepository: IShortUrlRepository;
  let shortUrlLogsRepository: IShortUrlLogsRepository;
  let createLogWhenUpdateUseCase: CreateLogWhenUpdateUseCase;
  let deleteShortUrlUseCase: DeleteShortUrlUseCase;
  let deleteShortUrlController: DeleteShortUrlController;

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
    deleteShortUrlUseCase = new DeleteShortUrlUseCase(
      shortUrlRepository,
      createLogWhenUpdateUseCase
    );
    deleteShortUrlController = new DeleteShortUrlController(
      deleteShortUrlUseCase
    );
  });

  test("should delete short url", async () => {
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
    const shortUrl = new ShortUrl(
      null,
      "localhost:3000",
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

    const [shortUrlsBeforeDelete] = await shortUrlRepository.findByUserId(
      user.id
    );

    const request = {
      params: {
        shortUrlId: shortUrlsBeforeDelete.getProps().id,
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

    const response = await deleteShortUrlController.handle(request, reply);

    expect(response).toBeNull();

    const shortUrlsAfterDelete = await shortUrlRepository.findByUserId(user.id);

    expect(shortUrlsAfterDelete).toHaveLength(0);
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
      deleteShortUrlController.handle(request, reply)
    ).rejects.toThrowError(ShortUrlNotFoundedError);
  });
});
