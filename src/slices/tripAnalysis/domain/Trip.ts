export class Trip {
  private vendorId: number;
  private pickupDatetime: Date;
  private dropoffDatetime: Date;
  private passengerCount: number;
  private tripDistance: number;
  private rateCodeId: number;
  private paymentType: number;
  private totalAmount: number;
  private tollsAmount: number;
  private mtaTax: number;
  private improvementSurcharge: number;
  private pickUpLocationId: number;
  private dropOffLocationId: number;

  constructor(
    vendorId: number,
    pickupDatetime: string,
    dropoffDatetime: string,
    passengerCount: number,
    tripDistance: number,
    rateCodeId: number,
    paymentType: number,
    totalAmount: number,
    tollsAmount: number,
    mtaTax: number,
    improvementSurcharge: number,
    pickUpLocationId: number,
    dropOffLocationId: number
  ) {
    this.vendorId = vendorId;
    this.pickupDatetime = new Date(pickupDatetime);
    this.dropoffDatetime = new Date(dropoffDatetime);
    this.passengerCount = passengerCount;
    this.tripDistance = this.formatToTwoDecimals(tripDistance);
    this.rateCodeId = rateCodeId;
    this.paymentType = paymentType;
    this.totalAmount = this.formatToTwoDecimals(totalAmount);
    this.tollsAmount = this.formatToTwoDecimals(tollsAmount);
    this.mtaTax = this.formatToTwoDecimals(mtaTax);
    this.improvementSurcharge = this.formatToTwoDecimals(improvementSurcharge);
    this.pickUpLocationId = pickUpLocationId;
    this.dropOffLocationId = dropOffLocationId;

    this.validate();
  }

  private formatToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  getDurationInMinutes(): number {
    return (this.dropoffDatetime.getTime() - this.pickupDatetime.getTime()) / (1000 * 60);
  }

  calculateNetMargin(): number {
    const costs = this.tollsAmount + this.mtaTax + this.improvementSurcharge;
    return this.formatToTwoDecimals(this.totalAmount - costs);
  }

  getProfitCategory(): "low" | "medium" | "high" {
    const netMargin = this.calculateNetMargin();
    if (netMargin < 10) return "low";
    if (netMargin >= 10 && netMargin < 20) return "medium";
    return "high";
  }

  getRouteDescription(): string {
    return `${this.pickUpLocationId} to ${this.dropOffLocationId}`;
  }

  validate(): void {
    if (this.passengerCount <= 0) {
      throw new Error("Passenger count must be greater than zero.");
    }
    if (this.tripDistance <= 0) {
      throw new Error("Trip distance must be greater than zero.");
    }
    if (this.totalAmount < 0) {
      throw new Error("Total amount cannot be negative.");
    }
  }

  getVendorId(): number {
    return this.vendorId;
  }

  getPickupDatetime(): Date {
    return this.pickupDatetime;
  }

  getDropoffDatetime(): Date {
    return this.dropoffDatetime;
  }

  getPassengerCount(): number {
    return this.passengerCount;
  }

  getTripDistance(): number {
    return this.tripDistance;
  }

  getRateCodeId(): number {
    return this.rateCodeId;
  }

  getPaymentType(): number {
    return this.paymentType;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getTollsAmount(): number {
    return this.tollsAmount;
  }

  getMtaTax(): number {
    return this.mtaTax;
  }

  getImprovementSurcharge(): number {
    return this.improvementSurcharge;
  }

  getPickUpLocationId(): number {
    return this.pickUpLocationId;
  }

  getDropOffLocationId(): number {
    return this.dropOffLocationId;
  }
}
