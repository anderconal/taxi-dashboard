import { Trip } from "./Trip";

export abstract class TripRepository {
    abstract fetchTrips(limit: number, offset: number): Promise<Trip[]>;
}
