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
import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { UserRepository } from "@infrastructure/prisma/user/user.repository.js";
import { User } from "@domain/entities/user.entity.js";

describe("UserRepository", () => {
  let repositoryMock: any;
  let userRepository: UserRepository;
  const spies: MockInstance<(...args: any[]) => any>[] = [];

  beforeEach(() => {
    repositoryMock = {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    };
    userRepository = new UserRepository(repositoryMock);
  });

  afterEach(() => {
    spies.forEach((s) => s.mockRestore());
    spies.length = 0;
  });

  it("should call create with correct data", async () => {
    const shortUrlData = {
      name: "teste",
      email: "email@teste.com",
      password: "123456",
    };

    const user = User.create(
      null,
      shortUrlData.name,
      shortUrlData.email,
      shortUrlData.password
    );

    await userRepository.create(user);

    const propsDataBeforeCreate = user.getProps();

    expect(repositoryMock.create).toHaveBeenCalledWith({
      data: {
        name: propsDataBeforeCreate.name,
        email: propsDataBeforeCreate.email,
        password: propsDataBeforeCreate.password,
        createdAt: propsDataBeforeCreate.createdAt,
        updatedAt: propsDataBeforeCreate.updatedAt,
      },
    });
  });

  it("should return null if findById returns null", async () => {
    repositoryMock.findFirst.mockResolvedValue(null);
    const result = await userRepository.findById("any-id");
    expect(result).toBeNull();
  });

  it("should return User instance when findById finds a record", async () => {
    const dbResponse = {
      id: "id1",
      name: "name",
      email: "email",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.findFirst.mockResolvedValue(dbResponse);

    const user = User.transformFromInternalClass(dbResponse);

    const spy = vi
      .spyOn(User, "transformFromInternalClass")
      .mockImplementation(() => user);
    spies.push(spy);

    const result = await userRepository.findById("id1");

    expect(repositoryMock.findFirst).toHaveBeenCalledWith({
      where: {
        id: dbResponse.id,
      },
    });
    expect(result).toBe(user);
  });

  it("should return null if findByEmail returns null", async () => {
    repositoryMock.findFirst.mockResolvedValue(null);
    const result = await userRepository.findByEmail("any-email");
    expect(result).toBeNull();
  });

  it("should return User instance when findByEmail finds a record", async () => {
    const dbResponse = {
      id: "id1",
      name: "name",
      email: "email",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.findFirst.mockResolvedValue(dbResponse);

    const user = User.transformFromInternalClass(dbResponse);

    const spy = vi
      .spyOn(User, "transformFromInternalClass")
      .mockImplementation(() => user);
    spies.push(spy);

    const result = await userRepository.findByEmail(dbResponse.email);

    expect(repositoryMock.findFirst).toHaveBeenCalledWith({
      where: {
        email: dbResponse.email,
      },
    });
    expect(result).toBe(user);
  });
});
