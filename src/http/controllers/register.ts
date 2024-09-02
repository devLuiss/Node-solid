import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserAlreadyExistError } from "src/use-cases/errors/user-already-exist-error";
import { z } from "zod";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
  });

  const { email, password, name } = registerBodySchema.parse(req.body);
  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ email, password, name });
  } catch (error) {
    if (error instanceof UserAlreadyExistError) {
      return res.status(409).send({ message: error.message });
    }
    throw error;
  }

  res.send({ message: "User created" });
}
