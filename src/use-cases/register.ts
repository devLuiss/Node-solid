import { hash } from "bcryptjs";
import { UsersRepository } from "src/repositories/users-repository";
import { UserAlreadyExistError } from "src/use-cases/errors/user-already-exist-error";

interface RegisterUseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUse {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistError();
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
