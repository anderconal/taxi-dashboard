import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";
import { Trip } from "../domain/Trip";

@ConstructorMetadataEmitter()
export class FilterTripsUseCase {
  constructor() {}

  execute(trips: Trip[], filterDate: string): Trip[] {
    if (!filterDate) return trips;

    return trips.filter(trip => trip.getPickupDatetime().toISOString().split("T")[0].startsWith(filterDate));
  }
}
