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
import { CreateShortUrlController } from "@presentation/http/controllers/shortUrl/create/create.controller";
import { CreateShortUrlUseCase } from "@application/use-cases/shortUrl/create/create.usecase";
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
import { IIdGenerator } from "@application/ports/types";
import { convertToBase } from "@shared/utils/convert";
import { IdentifierNotMatchRulesError } from "@shared/errors/IdentifierNotMatchRules";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";

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
    vi.clearAllMocks();

    userRepository = userRepositoryFactory();
    useCaseSignin = new SigninUseCase(userRepository);
    useCaseCreateUser = new CreateUserUseCase(userRepository);
    shortUrlRepository = shortUrlRepositoryFactory();

    useCaseCreateShortUrl = new CreateShortUrlUseCase(
      shortUrlRepository,
      mockIdGenerator
    );
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

    (mockIdGenerator.nextId as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      111222333444555666n
    );

    (vi.mocked(convertToBase) as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      "testID01"
    );

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

    expect(shortUrl).toBeInstanceOf(ShortUrl);
    expect(shortUrl?.getUrl()).toBe(payload.longUrl);
    expect(props?.expiresIn).toBe(payload.expiresIn);
    expect(props?.userId).toBe(user.id);
    expect(props?.identifier.getValue()).toBe("testID01");

    expect(mockIdGenerator.nextId).toHaveBeenCalledTimes(1);
    expect(vi.mocked(convertToBase)).toHaveBeenCalledWith(111222333444555666n);
  });

  test("should throw FailedGenerateIdentifierError if unable to generate unique identifier", async () => {
    const identifier = new IdentifierObjValue("failID01")
    vi.spyOn(shortUrlRepository, "findByIdentifier").mockResolvedValue(
      new ShortUrl(
        crypto.randomUUID(),
        "localhost:3000",
        null,
        null,
        "userId",
        toSpISOString(),
        toSpISOString(),
        identifier,
        "/teste",
        "http:"
      )
    );

    (mockIdGenerator.nextId as ReturnType<typeof vi.fn>).mockReturnValue(
      123n
    );
    (vi.mocked(convertToBase) as ReturnType<typeof vi.fn>).mockReturnValue(
      "failID012"
    );

    const payload = {
      longUrl: "http://localhost:3000/fail-test",
      expiresIn: null,
      userId: "user-id-test",
    };

    await expect(
      useCaseCreateShortUrl.execute(payload)
    ).rejects.toThrowError(IdentifierNotMatchRulesError);
  });
});
