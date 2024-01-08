import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarketOfferDto } from './dto/create-market-offer.dto';
import { UpdateMarketOfferDto } from './dto/update-market-offer.dto';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}

  async createOffer(dto: CreateMarketOfferDto) {
    return this.prisma.marketOffer.create({
      data: dto,
    });
  }

  async updateOffer(dto: UpdateMarketOfferDto) {
    return this.prisma.marketOffer.update({
      data: dto,
      where: { id: dto.id },
    });
  }

  async getOffer(offerId: string) {
    return this.prisma.marketOffer.findUnique({
      where: { id: offerId },
    });
  }
}
