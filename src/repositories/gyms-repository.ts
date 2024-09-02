import { Gym } from "@prisma/client";

export interface GymsRepository {
  findById(id: String): Promise<Gym | null>;
}
