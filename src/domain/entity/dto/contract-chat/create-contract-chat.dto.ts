import { ContractChat, DeliveryFrequency } from "@prisma/client";

export class CreateContractChatDto implements Partial<ContractChat> {
  offerId: string;

  sellerId: string;
  buyerId: string;

  deliveryFrequency: DeliveryFrequency;
  deliveryTimeSlot: string;

  deliveriesCount: number;
}
