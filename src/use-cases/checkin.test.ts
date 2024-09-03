import { InMemoryGymsepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "@/use-cases/checkin";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "./../repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsepository;
let sut: CheckInUseCase;
describe("check in use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsepository();
    sut = new CheckInUseCase(checkInsRepository, gymRepository);

    await gymRepository.create({
      title: "Academia1",
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: null,
      description: null,
      id: "gym-id",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await gymRepository.items.push({
      id: "gym-id2",
      title: "Academia jsGym",
      description: "asd",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: null,
    });
    // Garantindo que a função retorne uma Promise que será rejeitada
    await expect(
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(Error); // Aqui você espera que seja uma instância de Error
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
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
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      });
      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

      const { checkIn } = await sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      });

      expect(checkIn.id).toEqual(expect.any(String));
    };
});
