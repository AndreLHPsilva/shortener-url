import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { app } from "src/app";
import { CreateUserController } from "@presentation/http/controllers/user/create/create.controller";
import { CreateUserUseCase } from "@application/use-cases/user/create/create.usecase";
import { IUserRepository } from "@domain/interfaces/userRepository.interface";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "@domain/entities/user.entity";
import { UserAlreadyExistsError } from "@shared/errors/UserAlreadyExistsError";
import { ZodValidatorError } from "@shared/utils/zod/validator";

describe("Create user route", () => {
  let createUserController: CreateUserController;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    userRepository = userRepositoryFactory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createUserController = new CreateUserController(createUserUseCase);
  });

  test("should create user", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "securepass",
      confirmPassword: "securepass",
    };

    const request = {
      body: payload,
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    const response = await createUserController.handle(request, reply);

    expect(response).toBe(null);

    const responseUser = await userRepository.findByEmail(payload.email);

    expect(responseUser).not.toBeNull();
    expect(responseUser?.getProps().name).toBe(payload.name);
    expect(responseUser?.getProps().email).toBe(payload.email);
  });

  test("should return error user already exists", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "securepass",
      confirmPassword: "securepass",
    };

    await userRepository.create(
      User.create(null, payload.name, payload.email, payload.password)
    );

    const request = {
      body: payload,
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    await expect(createUserController.handle(request, reply)).rejects.toThrow(
      UserAlreadyExistsError
    );
  });

  test("should return error when payload is invalid", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "securepass",
    };

    const request = {
      body: payload,
    } as unknown as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      code: vi.fn().mockReturnThis(),
      send: vi.fn((data) => {
        return data;
      }),
    } as unknown as FastifyReply;

    await expect(createUserController.handle(request, reply)).rejects.toThrow(
      ZodValidatorError
    );
  });
});
