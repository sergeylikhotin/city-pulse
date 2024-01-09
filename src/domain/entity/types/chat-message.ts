import { Prisma } from "@prisma/client";

export type ChatMessage = Prisma.ContractChatMessageGetPayload<{
  include: {
    chat: true;
  };
}>;
