import { TripRepository } from "../domain/TripRepository";
import { Trip } from "../domain/Trip";
import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";

@ConstructorMetadataEmitter()
export class FetchTripsUseCase {
  constructor(private tripRepository: TripRepository) {}

  async execute(limit: number = 25, offset: number = 0): Promise<Trip[]> {
    return await this.tripRepository.fetchTrips(limit, offset);
  }
}
