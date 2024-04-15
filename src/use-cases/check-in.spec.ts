import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "JavasScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.5537939),
      longitude: new Decimal(-46.6598786),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -23.5537939,
      userLongitude: -46.6598786,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -23.5537939,
      userLongitude: -46.6598786,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-id",
        userLatitude: -23.5537939,
        userLongitude: -46.6598786,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to check in twice but different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -23.5537939,
      userLongitude: -46.6598786,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -23.5537939,
      userLongitude: -46.6598786,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavasScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.5578339),
      longitude: new Decimal(-46.6634708),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-id",
        userLatitude: -23.5537939,
        userLongitude: -46.6598786,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

// -23.5578339,-46.6634708
