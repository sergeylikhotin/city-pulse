import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { BankingService } from '../banking.service';

@Injectable()
export class PlayerBankingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bankingService: BankingService,
  ) {}

  createBankAccount(playerId: string) {
    return this.prisma.playerBankAccount.create({
      data: { playerId },
    });
  }

  getBankAccount(accountId: string) {
    return this.prisma.playerBankAccount.findUnique({
      where: { id: accountId },
    });
  }

  getBankAccountByPlayerId(playerId: string) {
    return this.prisma.playerBankAccount.findUnique({
      where: { playerId },
    });
  }

  deposit(playerAccountId: string, businessAccountId: string, amount: Decimal) {
    return this.bankingService.deposit(
      playerAccountId,
      businessAccountId,
      amount,
    );
  }

  withdrawal(
    businessAccountId: string,
    playerAccountId: string,
    amount: Decimal,
  ) {
    return this.bankingService.withdrawal(
      businessAccountId,
      playerAccountId,
      amount,
    );
  }

  transfer(amount: Decimal, fromAccountId: string, toAccountId: string) {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.playerBankAccount.update({
        data: {
          balance: { decrement: amount },
        },
        where: { id: fromAccountId },
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          'На банковском счёту Вашей учетной записи недостаточно средств',
        );

      await transaction.playerBankAccount.update({
        data: {
          balance: { increment: amount },
        },
        where: { id: toAccountId },
      });

      return transaction.playerBankAccountTransaction.create({
        data: {
          type: 'TRANSFER',
          amount,

          fromId: fromAccountId,
          toId: toAccountId,
        },
      });
    });
  }

  // deposit(amount: number) {}
}
