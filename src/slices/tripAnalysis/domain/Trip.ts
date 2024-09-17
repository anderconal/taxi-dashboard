export interface Trip {
  vendorId: number;
  taxiPassengerEnhancementProgramPickUpDateTime: string;
  taxiPassengerEnhancementProgramDropOffDateTime: string;
  passengerCount: number;
  tripDistance: number;
  rateCodeId: number;
  paymentType: number;
  totalAmount: number;
  pickUpLocationId: number;
  dropOffLocationId: number;
}
