export interface ApiTripDTO {
    vendorid: number;
    tpep_pickup_datetime: string;
    tpep_dropoff_datetime: string;
    passenger_count: number;
    trip_distance: number;
    ratecodeid: number;
    payment_type: number;
    total_amount: string;
    tolls_amount?: number;
    mta_tax?: number;
    improvement_surcharge?: number;
    pulocationid: number;
    dolocationid: number;
}
