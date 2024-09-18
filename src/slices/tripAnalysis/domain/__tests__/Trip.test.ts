import { describe, it, expect } from "vitest";
import { TripBuilder } from "./TripBuilder";
import { ProfitCategory } from "../../application/ProfitCategory";

describe("Trip", () => {
  
  it("calculates the net margin by subtracting costs from the total amount", () => {
    const trip = new TripBuilder()
      .withTotalAmount(30.5)
      .build();

    expect(trip.calculateNetMargin()).toBe(27.2);
  });

  it("throws an error when passenger count is zero or negative", () => {
    const builder = new TripBuilder().withPassengerCount(0);
    expect(() => builder.build()).toThrow("Passenger count must be greater than zero.");
  });

  describe("Profit Category Classification", () => {
    const testCases = [
      { totalAmount: 8, expectedCategory: ProfitCategory.Low },
      { totalAmount: 15, expectedCategory: ProfitCategory.Medium },
      { totalAmount: 30, expectedCategory: ProfitCategory.High },
    ];

    testCases.forEach(({ totalAmount, expectedCategory }) => {
      it(`classifies a trip with totalAmount=${totalAmount} as ${expectedCategory}`, () => {
        const trip = new TripBuilder().withTotalAmount(totalAmount).build();
        expect(trip.getProfitCategory()).toBe(expectedCategory);
      });
    });
  });

  it("throws an error when trip distance is zero or negative", () => {
    const builder = new TripBuilder().withTripDistance(-10);
    
    expect(() => builder.build()).toThrow("Trip distance must be greater than zero.");
  });

  it("calculates trip duration correctly in minutes", () => {
    const trip = new TripBuilder()
      .withPickupDatetime("2023-09-17T14:30:00Z")
      .withDropoffDatetime("2023-09-17T15:00:00Z")
      .build();

    expect(trip.getDurationInMinutes()).toBe(30);
  });

  it("throws an error when total amount is negative", () => {
    const builder = new TripBuilder().withTotalAmount(-5);

    expect(() => builder.build()).toThrow("Total amount cannot be negative.");
  });

  it("returns net margin as total amount when there are zero costs", () => {
    const trip = new TripBuilder()
      .withTotalAmount(30.5)
      .withTripDistance(10)
      .withTollsAmount(0)
      .withMtaTax(0)
      .withImprovementSurcharge(0)
      .build();

    expect(trip.calculateNetMargin()).toBe(30.5);
  });

  it("returns the correct route description", () => {
    const trip = new TripBuilder().build();
    expect(trip.getRouteDescription()).toBe("1 to 2");
  });

  describe("Invalid Trip Validation", () => {
    const invalidTrips = [
      { field: "passengerCount", value: 0, method: (builder: TripBuilder, value: number) => builder.withPassengerCount(value), error: "Passenger count must be greater than zero." },
      { field: "tripDistance", value: -1, method: (builder: TripBuilder, value: number) => builder.withTripDistance(value), error: "Trip distance must be greater than zero." },
      { field: "totalAmount", value: -5, method: (builder: TripBuilder, value: number) => builder.withTotalAmount(value), error: "Total amount cannot be negative." },
    ];

    invalidTrips.forEach(({ field, value, method, error }) => {
      it(`throws validation error for invalid ${field}`, () => {
        const builder = new TripBuilder();
        method(builder, value);
        expect(() => builder.build()).toThrow(error);
      });
    });
  });

  it("calculates the trip duration for multi-day trips", () => {
    const trip = new TripBuilder()
      .withPickupDatetime("2023-09-17T14:30:00Z")
      .withDropoffDatetime("2023-09-18T14:30:00Z")
      .build();

    expect(trip.getDurationInMinutes()).toBe(1440);
  });
});
