import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ContractChatStatus } from '@prisma/client';

import { ContractTermsEntity } from './contract-terms.entity';
import { CreateContractChatDto } from './dto/contract-chat/create-contract-chat.dto';
import { UpdateContractChatDto } from './dto/contract-chat/update-contract-chat.dto';
import { CloseContractChatDto } from './dto/contract-chat/close-contract-chat.dto';
import { SendContractChatMessageDto } from './dto/contract-chat/send-contract-chat-message.dto';

import { ChatMessage } from './types/chat-message';

@Injectable()
export class ContractChatEntity {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractTermsService: ContractTermsEntity,
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
