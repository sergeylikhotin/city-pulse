import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateBusinessDto } from './dto/business/create-business.dto';

@Injectable()
export class BusinessEntity {
  constructor(private readonly prisma: PrismaService) {}

  createBusiness(dto: CreateBusinessDto) {
    return this.prisma.business.create({
      data: dto,
    });
  }

  getBusiness(businessId: string) {
    return this.prisma.business.findUnique({
      where: { id: businessId },
      include: { products: true, account: true },
    });
  }

  getBusinessesByPlayer(playerId: string) {
    return this.prisma.business.findMany({
      where: { ownerId: playerId },
      include: { products: true, account: true },
    });
  }
}
