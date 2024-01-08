import { Injectable } from '@nestjs/common';
import { MarketOffer } from '@prisma/client';
import { MarketService } from '../../data-modules/market/market.service';
import { CreateMarketOfferDto } from '../../data-modules/market/dto/create-market-offer.dto';
import { GrammyUserError } from '../../grammy/grammy.user-error';
import { UpdateMarketOfferDto } from '../../data-modules/market/dto/update-market-offer.dto';
import { ContractChatService } from '../../data-modules/contract-chat/contract-chat.service';
import { RespondMarketOfferDto } from './dto/respond-market-offer.dto';

@Injectable()
export class MarketManagementService {
  constructor(
    private readonly marketService: MarketService,
    private readonly contractChatService: ContractChatService,
  ) {}

  createOffer(dto: CreateMarketOfferDto) {
    this.validateOfferDto(dto);

    return this.marketService.createOffer(dto);
  }

  updateOffer(dto: UpdateMarketOfferDto) {
    this.validateOfferDto(dto);

    return this.marketService.updateOffer(dto);
  }

  async respondOffer(dto: RespondMarketOfferDto) {
    const offer = await this.marketService.getOffer(dto.offerId);

    return await this.contractChatService.createChat({
      offerId: offer.id,

      sellerId: offer.sellerId,
      buyerId: dto.buyerId,

      deliveryFrequency: dto.deliveryFrequency,
      deliveryTimeSlot: dto.deliveryTimeSlot,

      deliveriesCount: dto.deliveriesCount,
    });
  }

  private validateOfferDto(dto: Partial<MarketOffer>) {
    if (dto.pricePerUnit.lt(0) || dto.quantity <= 0) {
      throw new GrammyUserError(
        'Вы не можете создать предложение с такими параметрами.',
      );
    }
  }
}
