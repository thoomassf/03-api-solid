import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyUseCaseUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyUseCaseUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyUseCaseUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -23.5578339,
      longitude: -46.6634708,
    });

    await gymsRepository.create({
      title: "For Gym",
      description: null,
      phone: null,
      latitude: -23.96503,
      longitude: -46.3207658,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5537939,
      userLongitude: -46.6598786,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
