import { ContractChatMessage } from "@prisma/client";

export class SendContractChatMessageDto
  implements Partial<ContractChatMessage> {
  chatId: string;
  senderId: string;

  body?: string;

  termsUpdated?: boolean;
  termsAccepted?: boolean;
}