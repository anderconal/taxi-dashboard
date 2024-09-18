import { TripRepository } from "../domain/TripRepository";
import { Trip } from "../domain/Trip";
import { Http } from "../../../shared/infrastructure/Http";
import { ApiTripDTO } from "./ApiTripDTO";
import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";
import { mockLocationMapping } from "./mocks/MockLocationMapping";

@ConstructorMetadataEmitter()
export class ApiTripRepository extends TripRepository {
  private static API_URL = import.meta.env.VITE_API_URL;
  private static API_TOKEN = import.meta.env.VITE_API_TOKEN;

  constructor(private http: Http) {
    super();
  }

  async fetchTrips(limit: number = 25, offset: number = 0): Promise<Trip[]> {
    const url = new URL(ApiTripRepository.API_URL);

    const sqlQuery = `
      SELECT 
        vendorid,
        tpep_pickup_datetime,
        tpep_dropoff_datetime,
        passenger_count,
        trip_distance,
        ratecodeid,
        payment_type,
        total_amount,
        tolls_amount,
        mta_tax,
        improvement_surcharge,
        pulocationid,
        dolocationid
      FROM _
      ORDER BY tpep_pickup_datetime
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    url.searchParams.append("q", sqlQuery);

    const result = await this.http.get<{ data: ApiTripDTO[] }>(url.toString(), {
      Authorization: `Bearer ${ApiTripRepository.API_TOKEN}`,
    });

    return result.data.map(apiTrip => this.mapApiTaxiTripToTaxiTrip(apiTrip));
  }

  private mapApiTaxiTripToTaxiTrip(apiTrip: ApiTripDTO): Trip {
    const pickUpLocation = mockLocationMapping[apiTrip.pulocationid] || `Unknown (${apiTrip.pulocationid})`;
    const dropOffLocation = mockLocationMapping[apiTrip.dolocationid] || `Unknown (${apiTrip.dolocationid})`;

    return new Trip(
      apiTrip.vendorid,
      apiTrip.tpep_pickup_datetime,
      apiTrip.tpep_dropoff_datetime,
      apiTrip.passenger_count,
      apiTrip.trip_distance,
      apiTrip.ratecodeid,
      apiTrip.payment_type,
      parseFloat(apiTrip.total_amount),
      apiTrip.tolls_amount || 0,
      apiTrip.mta_tax || 0,
      apiTrip.improvement_surcharge || 0,
      pickUpLocation,
      dropOffLocation
    );
  }
}
