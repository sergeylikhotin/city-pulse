import { ContractTerms, DeliveryFrequency } from '@prisma/client';
import Decimal from 'decimal.js';

export class CreateContractTermsDto implements Partial<ContractTerms> {
  quantity: number;
  pricePerUnit: Decimal;

  deliveryFrequency: DeliveryFrequency;
  deliveryTimeSlot: string;

  deliveriesCount: number;
}
