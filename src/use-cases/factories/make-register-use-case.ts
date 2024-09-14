import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUse } from "@/use-cases/register";
export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new RegisterUse(usersRepository);
  return useCase;
}
