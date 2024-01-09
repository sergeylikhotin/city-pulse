import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class BusinessEntity {
  constructor(private readonly prisma: PrismaService) {}

  createBusiness(playerId: string, type: string) {
    return this.prisma.business.create({
      data: {
        ownerId: playerId,
        type,
      },
    });
  }

  getBusiness(businessId: string) {
    return this.prisma.business.findUnique({
      where: { id: businessId },
      include: { products: true },
    });
  }

  getBusinessesByPlayer(playerId: string) {
    return this.prisma.business.findMany({
      where: { ownerId: playerId },
      include: { products: true },
    });
  }
}
