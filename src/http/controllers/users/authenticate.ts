import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);
  try {
    const authenticateUse = makeAuthenticateUseCase();
    const { user } = await authenticateUse.execute({ email, password });
    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );
    return res.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }
}
