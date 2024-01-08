import { DeliveryFrequency } from "@prisma/client";

export class RespondMarketOfferDto {
  offerId: string;
  buyerId: string;

  deliveryFrequency: DeliveryFrequency;
  deliveryTimeSlot: string;
  deliveriesCount: number;
}
