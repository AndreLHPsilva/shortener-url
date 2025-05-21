import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/interfaces/userRepository.interface";

export class UserInMemoryRepository implements IUserRepository {
  constructor(private users: User[] = []) {}

  async create(user: User): Promise<void> {
    const id = crypto.randomUUID();
    const userFinaly = User.create(
      id,
      user.getProps().name,
      user.getProps().email,
      user.getProps().password
    );

    this.users.push(userFinaly);
    return;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.getProps().email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.getProps().id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
