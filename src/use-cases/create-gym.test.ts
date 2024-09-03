import { InMemoryGymsepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "@/use-cases/create-gym";
import { beforeEach, describe, expect, it } from "vitest";
let gymRepository: InMemoryGymsepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Academia1",
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: null,
      description: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
