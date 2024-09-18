import { beforeEach, describe, it, expect, vi } from "vitest";
import { FetchTripsUseCase } from "../FetchTripsUseCase";
import { TripRepository } from "../../domain/TripRepository";
import { TripBuilder } from "../../domain/__tests__/TripBuilder";

describe("FetchTripsUseCase", () => {
  let fetchTripsUseCase: FetchTripsUseCase;
  let tripRepositoryMock: TripRepository;
  const defaultLimit = 25;
  const defaultOffset = 0;

  beforeEach(() => {
    tripRepositoryMock = {
      fetchTrips: vi.fn(),
    } as unknown as TripRepository;

    fetchTripsUseCase = new FetchTripsUseCase(tripRepositoryMock);
  });

  it("fetches trips with default limit and offset", async () => {
    const trips = [new TripBuilder().build(), new TripBuilder().build()];
    vi.spyOn(tripRepositoryMock, "fetchTrips").mockResolvedValue(trips);

    const result = await fetchTripsUseCase.execute();

    expect(tripRepositoryMock.fetchTrips).toHaveBeenCalledWith(defaultLimit, defaultOffset);
    expect(result).toEqual(trips);
  });

  it("fetches trips with provided limit and offset", async () => {
    const trips = [new TripBuilder().build(), new TripBuilder().build()];
    const limit = 10;
    const offset = 5;

    vi.spyOn(tripRepositoryMock, "fetchTrips").mockResolvedValue(trips);

    const result = await fetchTripsUseCase.execute(limit, offset);

    expect(tripRepositoryMock.fetchTrips).toHaveBeenCalledWith(limit, offset);
    expect(result).toEqual(trips);
  });

  it("returns an empty array if the repository returns no trips", async () => {
    vi.spyOn(tripRepositoryMock, "fetchTrips").mockResolvedValue([]);

    const result = await fetchTripsUseCase.execute();

    expect(tripRepositoryMock.fetchTrips).toHaveBeenCalledWith(defaultLimit, defaultOffset);
    expect(result).toEqual([]);
  });

  it("handles errors from the trip repository", async () => {
    const errorMessage = "Failed to fetch trips";
    vi.spyOn(tripRepositoryMock, "fetchTrips").mockRejectedValue(new Error(errorMessage));

    await expect(fetchTripsUseCase.execute()).rejects.toThrowError(errorMessage);
    expect(tripRepositoryMock.fetchTrips).toHaveBeenCalledWith(defaultLimit, defaultOffset);
  });
});
