import { Injectable } from '@nestjs/common';
import { ContractChatService } from '../../data-modules/contract-chat/contract-chat.service';
import { ContractService } from '../../data-modules/contract/contract.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GrammyUserError } from '../../grammy/grammy.user-error';
import { SendContractChatMessageDto } from '../../data-modules/contract-chat/dto/send-contract-chat-message.dto';
import { CloseContractChatDto } from '../../data-modules/contract-chat/dto/close-contract-chat.dto';

@Injectable()
export class ContractChatManagementService {
  constructor(
    private readonly contractService: ContractService,
    private readonly contractChatService: ContractChatService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(dto: SendContractChatMessageDto) {
    const message = await this.contractChatService.sendMessage(dto);

    if (message.termsUpdated) {
      message.chat = await this.contractChatService.updateChat({
        id: message.chatId,

        sellerAcceptTerms: message.senderId === message.chat.sellerId,
        buyerAcceptTerms: message.senderId === message.chat.buyerId,
      });
    } else if (message.termsAccepted) {
      message.chat = await this.contractChatService.updateChat({
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

    const contract = this.contractService.createContract({
      sellerId: chat.sellerId,
      buyerId: chat.buyerId,

      offerId: chat.offerId,
      termsId: chat.termsId,
    });

    this.eventEmitter.emit('contract.created', contract);
  }

  async closeChat(dto: CloseContractChatDto) {
    let chat = await this.contractChatService.getChat(dto.chatId);
    if (dto.closerId !== chat.sellerId && dto.closerId !== chat.buyerId) {
      throw new GrammyUserError(
        'Вы не можете закрыть чат в котором не участвуете!',
      );
    }

    chat = await this.contractChatService.closeChat(dto);
    this.eventEmitter.emit('chat.closed', chat);

    return chat;
  }
}
