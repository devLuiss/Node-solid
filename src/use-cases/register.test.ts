import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
// import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistError } from "@/use-cases/errors/user-already-exist-error";
import { describe, expect, it } from "vitest";
import { RegisterUse } from "./register";
describe("register use case", () => {
  it("should hash the password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    // const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUse(usersRepository);

    const { user } = await registerUseCase.execute({
      email: "jhondoee@gmail.com",
      password: "123456",
      name: "Jhon Doe",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not allow two users with the same email", async () => {
    const registerUseCase = new RegisterUse(new InMemoryUsersRepository());

    await registerUseCase.execute({
      email: "test@example.com",
      password: "password123",
      name: "Jhon Doe",
    });

    // Aqui, retornamos a Promise corretamente para expect(...).rejects funcionar
    await expect(
      registerUseCase.execute({
        email: "test@example.com",
        password: "password123",
        name: "Jhon Doe",
      })
    ).rejects.toThrowError(UserAlreadyExistError);
  });
});
