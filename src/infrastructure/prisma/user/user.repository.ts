import { User } from "@domain/entities/user.entity";
import { prisma } from "../prisma";
import { IUserRepository } from "./contract/userRepository.interface";

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

    return User.transformFromInternalClass(user);
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

    return User.transformFromInternalClass(user);
  }
}
