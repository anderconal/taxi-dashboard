import { TripRepository } from "../domain/TripRepository";
import { Trip } from "../domain/Trip";
import { Http } from "../../../shared/infrastructure/Http";
import { ApiTripDTO } from "./ApiTripDTO";
import { ConstructorMetadataEmitter } from "../../../dependency-injection/ConstructorMetadataEmitter";

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
        tpep_pickup_datetime,
        tpep_dropoff_datetime,
        passenger_count,
        trip_distance,
        total_amount,
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
    return {
      vendorId: apiTrip.vendorid,
      taxiPassengerEnhancementProgramPickUpDateTime: apiTrip.tpep_pickup_datetime,
      taxiPassengerEnhancementProgramDropOffDateTime: apiTrip.tpep_dropoff_datetime,
      passengerCount: apiTrip.passenger_count,
      tripDistance: apiTrip.trip_distance,
      rateCodeId: apiTrip.ratecodeid,
      paymentType: apiTrip.payment_type,
      totalAmount: parseFloat(apiTrip.total_amount),
      pickUpLocationId: apiTrip.pulocationid,
      dropOffLocationId: apiTrip.dolocationid,
    };
  }
}
