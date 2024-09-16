import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string().min(2),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(req.body);

  const CreateGymUseCase = makeCreateGymUseCase();

  await CreateGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  res.send({ message: "User created" });
}
