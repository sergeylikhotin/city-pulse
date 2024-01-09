import { ContractChat, ContractChatStatus } from "@prisma/client";

export class UpdateContractChatDto implements Partial<ContractChat> {
  id: string;

  sellerAcceptTerms?: boolean;
  buyerAcceptTerms?: boolean;

  status?: ContractChatStatus;
}
