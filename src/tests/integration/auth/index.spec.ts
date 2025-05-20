import {
  describe,
  expect,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { app } from "src/app";
import { CreateUserUseCase } from "@application/use-cases/user/create/create.usecase";
import { IUserRepository } from "@infrastructure/prisma/user/contract/userRepository.interface";
import { SigninUseCase } from "@application/use-cases/auth/signin/signin.usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { SigninController } from "@presentation/http/controllers/auth/signin/signin.controller";
import { EmailOrPasswordIncorrectError } from "@shared/errors/EmailOrPasswordIncorrectError";
import { UserInMemoryRepository } from "@infrastructure/inMemory/user/userInMemory.repository";

describe("Auth route", () => {
  let useCaseCreateUser: CreateUserUseCase;
  let userRepository: IUserRepository;
  let useCaseSignin: SigninUseCase;
  let signinController: SigninController;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    useCaseCreateUser = new CreateUserUseCase(userRepository);
    useCaseSignin = new SigninUseCase(userRepository);
    signinController = new SigninController(useCaseSignin);
  });

  test("should realize login", async () => {
    const email = `${crypto.randomUUID()}@example.com`;
    const payload = {
      name: "John Doe",
      email,
      password: "securepass",
    };

    await useCaseCreateUser.execute(payload);

    const responseAuth = await useCaseSignin.execute({
      email,
      password: payload.password,
    });

    expect(responseAuth.token).not.toBe(null);
    expect(responseAuth).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  test("should return error email or password invalid", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "securepass",
    };

    await useCaseCreateUser.execute(payload);

    const request = {
      body: {
        email: "outro@email.com",
        password: payload.password,
      },
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await expect(signinController.handle(request, reply)).rejects.toThrow(
      EmailOrPasswordIncorrectError
    );
  });
});
