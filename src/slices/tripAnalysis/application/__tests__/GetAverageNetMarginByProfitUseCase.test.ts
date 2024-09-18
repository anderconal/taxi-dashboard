import { describe, it, expect } from "vitest";
import { AverageNetMargin, GetAverageNetMarginByProfitUseCase } from "../GetAverageNetMarginByProfitUseCase";
import { TripBuilder } from "../../domain/__tests__/TripBuilder";
import { ProfitCategory } from "../ProfitCategory";
import { Trip } from "../../domain/Trip";


describe("GetAverageNetMarginByProfitUseCase", () => {
  const getAverageNetMarginByProfitUseCase = new GetAverageNetMarginByProfitUseCase();

  it("calculates correct average net margin for a single route", () => {
    const trips = [
      new TripBuilder()
        .withPickupDatetime("2023-09-18T10:00:00Z")
        .withTotalAmount(15)
        .withTollsAmount(5)
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T12:00:00Z")
        .withTotalAmount(12)
        .withTollsAmount(3)
        .build(),
    ];

    const result: AverageNetMargin[] = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Low);

    expect(result.length).toBe(1);
    expect(result[0].route).toBe("1 to 2");
    expect(result[0].averageNetMargin).toBeCloseTo(8.7);
  });

  it("returns an empty array when no trips match the given profit category", () => {
    const trips = [
      new TripBuilder()
        .withTotalAmount(50)
        .withTollsAmount(10)
        .build(),
      new TripBuilder()
        .withTotalAmount(60)
        .withTollsAmount(20)
        .build(),
    ];

    const result = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Low);

    expect(result.length).toBe(0);
  });

  const categories = [
    { totalAmount: 5, tollsAmount: 1, expectedNetMargin: 3.2, expectedCategory: ProfitCategory.Low },
    { totalAmount: 6, tollsAmount: 2, expectedNetMargin: 3.2, expectedCategory: ProfitCategory.Low },
  ];

  categories.forEach(({ totalAmount, tollsAmount, expectedNetMargin, expectedCategory }) => {
    it(`filters trips by ${expectedCategory} and calculates the correct average net margin`, () => {
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
    const trips = [
      new TripBuilder()
        .withPickupDatetime("2023-09-18T10:00:00Z")
        .withTotalAmount(30)
        .withTollsAmount(15)
        .withPickUpLocationId("1")
        .withDropOffLocationId("2")
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T12:00:00Z")
        .withTotalAmount(25)
        .withTollsAmount(12)
        .withPickUpLocationId("3")
        .withDropOffLocationId("4")
        .build(),
      new TripBuilder()
        .withPickupDatetime("2023-09-18T14:00:00Z")
        .withTotalAmount(32)
        .withTollsAmount(18)
        .withPickUpLocationId("1")
        .withDropOffLocationId("2")
        .build(),
    ];

    const result: AverageNetMargin[] = getAverageNetMarginByProfitUseCase.execute(trips, ProfitCategory.Medium);

    expect(result.length).toBe(2);
    expect(result[0].route).toBe("1 to 2");
    expect(result[1].route).toBe("3 to 4");

    const avgNetMarginRoute1 = ((30 - 15.8) + (32 - 18.8)) / 2;
    const avgNetMarginRoute2 = 25 - 12.8;

    expect(result[0].averageNetMargin).toBeCloseTo(avgNetMarginRoute1);
    expect(result[1].averageNetMargin).toBeCloseTo(avgNetMarginRoute2);
  });
});
