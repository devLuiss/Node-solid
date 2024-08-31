import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "src/use-cases/authenticate";
import { z } from "zod";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);
  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticateUse = new AuthenticateUseCase(prismaUsersRepository);
    await authenticateUse.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }

  res.status(200).send();
}
