import { describe, it, expect } from "vitest";

import { Trip } from "../../domain/Trip";
import { FilterTripsUseCase } from "../FilterTripsUseCase";
import { TripBuilder } from "../../domain/__tests__/TripBuilder";

describe("FilterTripsUseCase", () => {
  const filterTripsUseCase = new FilterTripsUseCase();

  it("filters trips by exact date", () => {
    const mockTrips = [
      new TripBuilder().withPickupDatetime("2023-09-18T10:00:00Z").build(),
      new TripBuilder().withPickupDatetime("2023-09-18T12:00:00Z").build(),
      new TripBuilder().withPickupDatetime("2023-09-19T09:00:00Z").build()
    ];

    const filteredTrips = filterTripsUseCase.execute(mockTrips, "2023-09-18");

    expect(filteredTrips.length).toBe(2);
    expect(filteredTrips[0].getPickupDatetime().toISOString()).toBe("2023-09-18T10:00:00.000Z");
    expect(filteredTrips[1].getPickupDatetime().toISOString()).toBe("2023-09-18T12:00:00.000Z");
  });

  it("returns all trips when filterDate is empty", () => {
    const mockTrips = [
      new TripBuilder().withPickupDatetime("2023-09-18T10:00:00Z").build(),
      new TripBuilder().withPickupDatetime("2023-09-19T12:00:00Z").build()
    ];

    const filteredTrips = filterTripsUseCase.execute(mockTrips, "");

    expect(filteredTrips.length).toBe(2);
  });

  it("returns an empty array when trips array is empty", () => {
    const mockTrips: Trip[] = [];

    const filteredTrips = filterTripsUseCase.execute(mockTrips, "2023-09-18");

    expect(filteredTrips.length).toBe(0);
  });

  it("returns an empty array when no trips match the filterDate", () => {
    const mockTrips = [
      new TripBuilder().withPickupDatetime("2023-09-17T10:00:00Z").build(),
      new TripBuilder().withPickupDatetime("2023-09-19T12:00:00Z").build()
    ];

    const filteredTrips = filterTripsUseCase.execute(mockTrips, "2023-09-18");

    expect(filteredTrips.length).toBe(0);
  });

  it("returns no trips when filterDate has an invalid format", () => {
    const mockTrips = [
      new TripBuilder().withPickupDatetime("2023-09-18T10:00:00Z").build(),
      new TripBuilder().withPickupDatetime("2023-09-19T12:00:00Z").build()
    ];

    const filteredTrips = filterTripsUseCase.execute(mockTrips, "invalid-date");

    expect(filteredTrips.length).toBe(0);
  });
});
