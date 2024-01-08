import { Injectable } from '@nestjs/common';
import { BankingService } from '../banking.service';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BusinessBankingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bankingService: BankingService,
  ) {}

  createBankAccount(businessId: string) {
    return this.prisma.businessBankAccount.create({
      data: { businessId },
    });
  }

  getBankAccount(accountId: string) {
    return this.prisma.businessBankAccount.findUnique({
      where: { id: accountId },
    });
  }

  getBankAccountByBusinessId(businessId: string) {
    return this.prisma.businessBankAccount.findUnique({
      where: { businessId },
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

  payment(amount: Decimal, fromAccountId: string, toAccountId: string) {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.businessBankAccount.update({
        data: {
          balance: { decrement: amount },
        },
        where: { id: fromAccountId },
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          'На банковском счёту Вашего бизнеса недостаточно средств',
        );

      await transaction.businessBankAccount.update({
        data: {
          balance: { increment: amount },
        },
        where: { id: toAccountId },
      });

      return transaction.businessBankAccountTransaction.create({
        data: {
          type: 'TRANSFER',
          amount,

          fromId: fromAccountId,
          toId: toAccountId,
        },
      });
    });
  }
}
