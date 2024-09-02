import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

export class InMemoryGymsepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: String) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
