import { Trip } from "../Trip";

export class TripBuilder {
  private vendorId = 1;
  private pickupDatetime = "2023-09-17T14:30:00Z";
  private dropoffDatetime = "2023-09-17T15:00:00Z";
  private passengerCount = 1;
  private tripDistance = 10;
  private rateCodeId = 1;
  private paymentType = 1;
  private totalAmount = 30.5;
  private tollsAmount = 2.5;
  private mtaTax = 0.5;
  private improvementSurcharge = 0.3;
  private pickUpLocationId = "1";
  private dropOffLocationId = "2";

  withPickupDatetime(date: string): TripBuilder {
    this.pickupDatetime = date;
    return this;
  }

  withDropoffDatetime(date: string): TripBuilder {
    this.dropoffDatetime = date;
    return this;
  }

  withPassengerCount(count: number): TripBuilder {
    this.passengerCount = count;
    return this;
  }

  withTotalAmount(amount: number): TripBuilder {
    this.totalAmount = amount;
    return this;
  }

  withTripDistance(distance: number): TripBuilder {
    this.tripDistance = distance;
    return this;
  }

  withTollsAmount(amount: number): TripBuilder {
    this.tollsAmount = amount;
    return this;
  }

  withMtaTax(amount: number): TripBuilder {
    this.mtaTax = amount;
    return this;
  }

  withImprovementSurcharge(amount: number): TripBuilder {
    this.improvementSurcharge = amount;
    return this;
  }

  withPickUpLocationId(id: string): TripBuilder {
    this.pickUpLocationId = id;
    return this;
  }

  withDropOffLocationId(id: string): TripBuilder {
    this.dropOffLocationId = id;
    return this;
  }

  build(): Trip {
    return new Trip(
      this.vendorId,
      this.pickupDatetime,
      this.dropoffDatetime,
      this.passengerCount,
      this.tripDistance,
      this.rateCodeId,
      this.paymentType,
      this.totalAmount,
      this.tollsAmount,
      this.mtaTax,
      this.improvementSurcharge,
      this.pickUpLocationId,
      this.dropOffLocationId
    );
  }
}
