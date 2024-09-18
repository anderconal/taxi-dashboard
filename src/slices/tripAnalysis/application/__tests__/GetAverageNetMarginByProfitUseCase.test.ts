import { describe, it, expect } from "vitest";
import { AverageNetMargin, GetAverageNetMarginByProfitUseCase } from "../GetAverageNetMarginByProfitUseCase";
import { TripBuilder } from "../../domain/__tests__/TripBuilder";
import { ProfitCategory } from "../ProfitCategory";
import { Trip } from "../../domain/Trip";

describe("GetAverageNetMarginByProfitUseCase", () => {
  const getAverageNetMarginByProfitUseCase = new GetAverageNetMarginByProfitUseCase();
  const baseCommissionRate = 0.8;

  it("calculates correct average net margin for a single route", () => {
    const firstTripTotalAmount = 15;
    const firstTripTollsAmount = 5;
    const secondTripTotalAmount = 12;
    const secondTripTollsAmount = 3;

    const firstTripNetMargin = firstTripTotalAmount - (firstTripTollsAmount + baseCommissionRate);
    const secondTripNetMargin = secondTripTotalAmount - (secondTripTollsAmount + baseCommissionRate);
    const expectedAverageNetMargin = (firstTripNetMargin + secondTripNetMargin) / 2;

    const trips = [
      new TripBuilder()
        .withPickupDatetime("2023-09-18T10:00:00Z")
        .withTotalAmount(firstTripTotalAmount)
        .withTollsAmount(firstTripTollsAmount)
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T12:00:00Z")
        .withTotalAmount(secondTripTotalAmount)
        .withTollsAmount(secondTripTollsAmount)
        .build(),
    ];

    const result: AverageNetMargin[] = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Low);

    expect(result.length).toBe(1);
    expect(result[0].route).toBe("1 to 2");
    expect(result[0].averageNetMargin).toBeCloseTo(expectedAverageNetMargin);
  });

  it("returns an empty array when no trips match the given profit category", () => {
    const highProfitTotalAmount = 50;
    const highProfitTollsAmount = 10;
    const veryHighProfitTotalAmount = 60;
    const veryHighProfitTollsAmount = 20;

    const trips = [
      new TripBuilder()
        .withTotalAmount(highProfitTotalAmount)
        .withTollsAmount(highProfitTollsAmount)
        .build(),
      new TripBuilder()
        .withTotalAmount(veryHighProfitTotalAmount)
        .withTollsAmount(veryHighProfitTollsAmount)
        .build(),
    ];

    const result = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Low);

    expect(result.length).toBe(0);
  });

  const categories = [
    { totalAmount: 5, tollsAmount: 1, expectedCategory: ProfitCategory.Low },
    { totalAmount: 6, tollsAmount: 2, expectedCategory: ProfitCategory.Low },
  ];

  categories.forEach(({ totalAmount, tollsAmount, expectedCategory }) => {
    it(`filters trips by ${expectedCategory} and calculates the correct average net margin`, () => {
      const expectedNetMargin = totalAmount - (tollsAmount + baseCommissionRate);

      const trips = [
        new TripBuilder()
          .withTotalAmount(totalAmount)
          .withTollsAmount(tollsAmount)
          .build(),
        new TripBuilder()
          .withTotalAmount(totalAmount)
          .withTollsAmount(tollsAmount)
          .build(),
      ];

      const result: AverageNetMargin[] = getAverageNetMarginByProfitUseCase.execute(trips, expectedCategory);

      expect(result.length).toBe(1);
      expect(result[0].route).toBe("1 to 2");
      expect(result[0].averageNetMargin).toBeCloseTo(expectedNetMargin);
    });
  });

  it("returns an empty array when the input trip array is empty", () => {
    const trips: Trip[] = [];

    const result = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Low);

    expect(result.length).toBe(0);
  });

  it("calculates average net margins for multiple routes", () => {
    const firstRouteTripOneTotalAmount = 30;
    const firstRouteTripOneTollsAmount = 15;
    const secondRouteTripTotalAmount = 25;
    const secondRouteTripTollsAmount = 12;
    const firstRouteTripTwoTotalAmount = 32;
    const firstRouteTripTwoTollsAmount = 18;

    const trips = [
      new TripBuilder()
        .withPickupDatetime("2023-09-18T10:00:00Z")
        .withTotalAmount(firstRouteTripOneTotalAmount)
        .withTollsAmount(firstRouteTripOneTollsAmount)
        .withPickUpLocationId("1")
        .withDropOffLocationId("2")
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T12:00:00Z")
        .withTotalAmount(secondRouteTripTotalAmount)
        .withTollsAmount(secondRouteTripTollsAmount)
        .withPickUpLocationId("3")
        .withDropOffLocationId("4")
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T14:00:00Z")
        .withTotalAmount(firstRouteTripTwoTotalAmount)
        .withTollsAmount(firstRouteTripTwoTollsAmount)
        .withPickUpLocationId("1")
        .withDropOffLocationId("2")
        .build(),
    ];

    const result: AverageNetMargin[] = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Medium);

    expect(result.length).toBe(2);
    expect(result[0].route).toBe("1 to 2");
    expect(result[1].route).toBe("3 to 4");

    const firstRouteTripOneNetMargin = firstRouteTripOneTotalAmount - (firstRouteTripOneTollsAmount + baseCommissionRate);
    const firstRouteTripTwoNetMargin = firstRouteTripTwoTotalAmount - (firstRouteTripTwoTollsAmount + baseCommissionRate);
    const avgNetMarginRoute1 = (firstRouteTripOneNetMargin + firstRouteTripTwoNetMargin) / 2;
    const avgNetMarginRoute2 = secondRouteTripTotalAmount - (secondRouteTripTollsAmount + baseCommissionRate);

    expect(result[0].averageNetMargin).toBeCloseTo(avgNetMarginRoute1);
    expect(result[1].averageNetMargin).toBeCloseTo(avgNetMarginRoute2);
  });
});