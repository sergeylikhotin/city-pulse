import { Contract, ContractStatus } from '@prisma/client';

export class UpdateContractDto implements Partial<Contract> {
  id: string;

  deliveriesLeft: number;
  status?: ContractStatus;
}
