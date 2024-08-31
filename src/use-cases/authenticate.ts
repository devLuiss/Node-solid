import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UsersRepository } from "src/repositories/users-repository";
import { InvalidCredentialsError } from "src/use-cases/errors/invalid-credentials-error";

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    // 1. Verificar se o usuário existe
    // 2. Verificar se a senha está correta
    // 3. Gerar token de autenticação
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
