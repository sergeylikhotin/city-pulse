import { Injectable } from '@nestjs/common';

import { GrammyUserError } from '../../../infrastructure/grammy/grammy.user-error';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ContractChatEntity } from '../../entity/contract-chat.entity';
import { ContractEntity } from '../../entity/contract.entity';

import { SendContractChatMessageDto } from '../../entity/dto/contract-chat/send-contract-chat-message.dto';
import { CloseContractChatDto } from '../../entity/dto/contract-chat/close-contract-chat.dto';

@Injectable()
export class ContractChatManagementService {
  constructor(
    private readonly contractEntity: ContractEntity,
    private readonly contractChatEntity: ContractChatEntity,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(dto: SendContractChatMessageDto) {
    const message = await this.contractChatEntity.sendMessage(dto);

    if (message.termsUpdated) {
      message.chat = await this.contractChatEntity.updateChat({
        id: message.chatId,

        sellerAcceptTerms: message.senderId === message.chat.sellerId,
        buyerAcceptTerms: message.senderId === message.chat.buyerId,
      });
    } else if (message.termsAccepted) {
      message.chat = await this.contractChatEntity.updateChat({
        id: message.chatId,

        sellerAcceptTerms:
          message.senderId === message.chat.sellerId ||
          message.chat.sellerAcceptTerms,
        buyerAcceptTerms:
          message.senderId === message.chat.buyerId ||
          message.chat.buyerAcceptTerms,
      });
    }

    const { chat } = message;
    if (!chat.sellerAcceptTerms || !chat.buyerAcceptTerms) return;

    const contract = this.contractEntity.createContract({
      sellerId: chat.sellerId,
      buyerId: chat.buyerId,

      offerId: chat.offerId,
      termsId: chat.termsId,
    });

    this.eventEmitter.emit('contract.created', contract);
  }

  async closeChat(dto: CloseContractChatDto) {
    let chat = await this.contractChatEntity.getChat(dto.chatId);
    if (dto.closerId !== chat.sellerId && dto.closerId !== chat.buyerId) {
      throw new GrammyUserError(
        'Вы не можете закрыть чат в котором не участвуете!',
      );
    }

    chat = await this.contractChatEntity.closeChat(dto);
    this.eventEmitter.emit('chat.closed', chat);

    return chat;
  }
}
