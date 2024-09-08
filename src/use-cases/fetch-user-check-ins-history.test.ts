import { FetchUserCheckInHistoryUseCase } from "@/use-cases/fetch-user-check-ins-history";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "./../repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryUseCase;
describe("fetch user check in history use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch check-ins history", async () => {
    await checkInsRepository.create({
      user_Id: "user-id1",
      gym_Id: "gym-id1",
      created_at: new Date(),
    });

    await checkInsRepository.create({
      user_Id: "user-id1",
      gym_Id: "gym-id2",
      created_at: new Date(),
    });

    const { checkIn } = await sut.execute({
      userId: "user-id1",
      page: 1,
    });

    await expect(checkIn).toHaveLength(2);
    await expect(checkIn).toEqual([
      expect.objectContaining({
        user_Id: "user-id1",
        gym_Id: "gym-id1",
      }),
      expect.objectContaining({
        user_Id: "user-id1",
        gym_Id: "gym-id2",
      }),
    ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 0; i <= 22; i++) {
      await checkInsRepository.create({
        user_Id: "user-id1",
        gym_Id: `gym-id${i}`,
        created_at: new Date(),
      });
    }

    const { checkIn } = await sut.execute({
      userId: "user-id1",
      page: 2,
    });

    await expect(checkIn).toHaveLength(3);
    await expect(checkIn).toEqual([
      expect.objectContaining({
        gym_Id: "gym-id20",
      }),
      expect.objectContaining({
        gym_Id: "gym-id21",
      }),
      expect.objectContaining({
        gym_Id: "gym-id22",
      }),
    ]);

    console.log(checkIn);
  });
});
