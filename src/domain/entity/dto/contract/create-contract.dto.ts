import { Contract, ContractStatus } from '@prisma/client';

export class CreateContractDto implements Partial<Contract> {
  offerId: string;
  termsId: string;

  sellerId: string;
  buyerId: string;

  status?: ContractStatus;
}
