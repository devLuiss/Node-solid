import { Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
  findById(id: String): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
