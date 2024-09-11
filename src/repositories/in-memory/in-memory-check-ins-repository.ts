import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find((checkin) => {
      const checkInDate = dayjs(checkin.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkin.user_Id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_Id: data.user_Id,
      gym_Id: data.gym_Id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkin) => checkin.user_Id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.items.filter((checkin) => checkin.user_Id === userId).length;
  }

  async findById(id: string) {
    const checkIn = this.items.find((checkin) => checkin.id === id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const index = this.items.findIndex((item) => item.id === checkIn.id);
    if (index >= 0) {
      this.items[index] = checkIn;
    }
    return checkIn;
  }
}
