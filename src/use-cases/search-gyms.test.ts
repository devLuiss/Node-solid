import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "@/use-cases/search-gym";
import { beforeEach, describe, expect, it } from "vitest";

let GymsRepository: InMemoryGymsepository;
let sut: SearchGymsUseCase;
describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsepository();
    sut = new SearchGymsUseCase(GymsRepository);
  });

  it("should be able to search gyms", async () => {
    await GymsRepository.create({
      title: "Academia1",
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: null,
      description: null,
    });

    await GymsRepository.create({
      title: "Academia2",
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: null,
      description: null,
    });

    const { gyms } = await sut.execute({
      query: "Academia2",
      page: 0,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Academia2",
        }),
      ])
    );
  });

  it("should be able to search gyms with pagination", async () => {
    for (let i = 0; i <= 22; i++) {
      await GymsRepository.create({
        title: `Academia${i}`,
        latitude: -27.0747279,
        longitude: -49.4889672,
        phone: null,
        description: null,
      });
    }

    const { gyms } = await sut.execute({
      query: "Academia",
      page: 2,
    });

    expect(gyms).toHaveLength(3);

    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Academia20",
        }),
        expect.objectContaining({
          title: "Academia21",
        }),
        expect.objectContaining({
          title: "Academia22",
        }),
      ])
    );
  });
});
