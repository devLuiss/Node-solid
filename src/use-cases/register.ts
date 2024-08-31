import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UsersRepository } from "src/repositories/users-repository";
import { UserAlreadyExistError } from "src/use-cases/errors/user-already-exist-error";

interface RegisterUseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseResponse {
  user: User;
}

export class RegisterUse {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseRequest): Promise<RegisterUseResponse> {
    const password_hash = await bcrypt.hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
