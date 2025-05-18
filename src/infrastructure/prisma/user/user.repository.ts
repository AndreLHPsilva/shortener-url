import { User } from "@domain/entities/user.entity.js";
import { prisma } from "../prisma.js";
import { IUserRepository } from "./contract/userRepository.interface.js";
import { toSpISOString } from "@shared/utils/date/index.js";

export class UserRepository implements IUserRepository {
  constructor(private repository = prisma.users) {}

  async create(user: User): Promise<void> {
    const userData = user.getProps();

    await this.repository.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });

    return;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      toSpISOString(new Date(user.createdAt)),
      toSpISOString(new Date(user.updatedAt))
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      toSpISOString(new Date(user.createdAt)),
      toSpISOString(new Date(user.updatedAt))
    );
  }
}
