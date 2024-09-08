import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

export class InMemoryGymsepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: String) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice(page * 10, page * 10 + 10);
  }
}
