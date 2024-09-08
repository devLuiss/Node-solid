import { GetUserMetricsUseCase } from "@/use-cases/get-user-metrics";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "./../repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;
describe("get user metrics use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get user check-ins count", async () => {
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

    await checkInsRepository.create({
      user_Id: "user-id1",
      gym_Id: "gym-id2",
      created_at: new Date(),
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id1",
    });

    await expect(checkInsCount).toEqual(3);
  });
});
