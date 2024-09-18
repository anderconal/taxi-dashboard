import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";
import { Trip } from "../domain/Trip";

export interface AverageNetMargin {
  route: string;
  averageNetMargin: number;
}

@ConstructorMetadataEmitter()
export class GetAverageNetMarginByProfitUseCase {
  constructor() {}

  async execute(trips: Trip[], profitCategory: "low" | "medium" | "high"): Promise<AverageNetMargin[]> {

    const filteredTrips = trips.filter(trip => trip.getProfitCategory() === profitCategory);

    const marginsByRoute: Record<string, number[]> = {};
    filteredTrips.forEach(trip => {
      const route = trip.getRouteDescription();
      if (!marginsByRoute[route]) {
        marginsByRoute[route] = [];
      }
      marginsByRoute[route].push(trip.calculateNetMargin());
    });

    const averageMargins = Object.entries(marginsByRoute).map(([route, margins]) => ({
      route,
      averageNetMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
    }));

    return averageMargins;
  }
}
