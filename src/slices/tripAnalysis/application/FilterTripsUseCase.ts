import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";
import { Trip } from "../domain/Trip";

@ConstructorMetadataEmitter()
export class FilterTripsUseCase {
  constructor() {}

  execute(trips: Trip[], filterDate: string): Trip[] {
    if (!filterDate) return trips;

    return trips.filter(trip => trip.taxiPassengerEnhancementProgramPickUpDateTime.startsWith(filterDate));
  }
}
