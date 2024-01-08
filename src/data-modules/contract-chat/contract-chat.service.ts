import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContractChatDto } from './dto/create-contract-chat.dto';
import { UpdateContractChatDto } from './dto/update-contract-chat.dto';
import { SendContractChatMessageDto } from './dto/send-contract-chat-message.dto';
import { ContractChatStatus, Prisma } from '@prisma/client';
import { ContractTermsService } from '../contract-terms/contract-terms.service';
import { CloseContractChatDto } from './dto/close-contract-chat.dto';

export type ChatMessage = Prisma.ContractChatMessageGetPayload<{
  include: {
    chat: true;
  };
}>;

@Injectable()
export class ContractChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractTermsService: ContractTermsService,
  ) {}

  async createChat(dto: CreateContractChatDto) {
    const {
      id: offerId,
      quantity,
      pricePerUnit,
    } = await this.prisma.marketOffer.findUnique({
      where: { id: dto.offerId },
    });
    const { id: termsId } = await this.contractTermsService.createTerms({
      quantity: quantity,
      pricePerUnit: pricePerUnit,

      deliveryFrequency: dto.deliveryFrequency,
      deliveryTimeSlot: dto.deliveryTimeSlot,
      deliveriesCount: dto.deliveriesCount,
    });

    return this.prisma.contractChat.create({
      data: {
        offerId,
        termsId,

        sellerId: dto.sellerId,
        buyerId: dto.buyerId,
      },
    });
  }

  async updateChat(dto: UpdateContractChatDto) {
    return this.prisma.contractChat.update({
      data: dto,
      where: { id: dto.id },
    });
  }

  async getChat(chatId: string) {
    return this.prisma.contractChat.findUnique({
      where: { id: chatId },
    });
  }

  async closeChat(dto: CloseContractChatDto) {
    return this.prisma.contractChat.update({
      data: {
        status: ContractChatStatus.CLOSED,
        closerId: dto.closerId,
      },
      where: { id: dto.chatId },
    });
  }

  async sendMessage(dto: SendContractChatMessageDto): Promise<ChatMessage> {
    return this.prisma.contractChatMessage.create({
      data: dto,
      include: {
        chat: true,
      },
    });
  }
}
