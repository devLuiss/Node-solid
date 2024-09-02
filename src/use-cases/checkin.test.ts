import { InMemoryGymsepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "@/use-cases/checkin";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "./../repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsepository;
let sut: CheckInUseCase;
describe("check in use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsepository();
    sut = new CheckInUseCase(checkInsRepository, gymRepository);
    vi.useFakeTimers();

    gymRepository.items.push({
      id: "gym-id",
      title: "Academia jsGym",
      description: "asd",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice on dif days"),
    async () => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

      await sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: 0,
        userLongitude: 0,
      });
      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

      const { checkIn } = await sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: 0,
        userLongitude: 0,
      });

      expect(checkIn.id).toEqual(expect.any(String));
    };
});
