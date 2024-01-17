import { Injectable } from '@nestjs/common';

import { MarketOffer } from '@prisma/client';
import { GrammyUserError } from '../../../infrastructure/grammy/grammy.user-error';

import { MarketEntity } from '../../entity/market.entity';
import { CreateMarketOfferDto } from '../../entity/dto/market/create-market-offer.dto';
import { UpdateMarketOfferDto } from '../../entity/dto/market/update-market-offer.dto';
import { ContractChatEntity } from '../../entity/contract-chat.entity';

import { RespondMarketOfferDto } from './dto/respond-market-offer.dto';

@Injectable()
export class MarketManagementService {
  constructor(
    private readonly marketEntity: MarketEntity,
    private readonly contractChatEntity: ContractChatEntity,
  ) {}

  createOffer(dto: CreateMarketOfferDto) {
    this.validateOfferDto(dto);

    return this.marketEntity.createOffer(dto);
  }

  updateOffer(dto: UpdateMarketOfferDto) {
    this.validateOfferDto(dto);

    return this.marketEntity.updateOffer(dto);
  }

  async respondOffer(dto: RespondMarketOfferDto) {
    const offer = await this.marketEntity.getOffer(dto.offerId);

    return await this.contractChatEntity.createChat({
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
