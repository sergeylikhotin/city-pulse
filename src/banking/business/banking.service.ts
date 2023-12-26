import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessBankingService {
  constructor(private readonly prisma: PrismaService) {}

  createBusinessBankAccount(businessId: string) {
    return this.prisma.businessBankAccount.create({
      data: {
        ownerId: businessId,
      },
    });
  }
}
