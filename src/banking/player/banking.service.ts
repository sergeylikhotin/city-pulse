import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerBankingService {
  constructor(private readonly prisma: PrismaService) {}

  createPlayerBankAccount(playerId: string) {
    return this.prisma.playerBankAccount.create({
      data: {
        ownerId: playerId,
      },
    });
  }
}
