import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BankAccountTransactionType,
  BusinessBankAccountTransaction,
  PlayerBankAccountTransaction,
  PrismaClient,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PlayerBankingService {
  constructor(private readonly prisma: PrismaService) {}

  createBankAccount(playerId: string) {
    return this.prisma.playerBankAccount.create({
      data: { playerId },
    });
  }

  deposit(
    amount: Decimal,
    playerAccountId: string,
    businessAccountId: string,
  ): Promise<[PlayerBankAccountTransaction, BusinessBankAccountTransaction]> {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.playerBankAccount.update({
        data: {
          balance: { decrement: amount },
        },
        where: { id: playerAccountId },
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          'На банковском счёту Вашей учетной записи недостаточно средств',
        );

      await transaction.businessBankAccount.update({
        data: {
          balance: { increment: amount },
        },
        where: {
          id: businessAccountId,
          business: {
            owner: { account: { id: playerAccountId } },
          },
        },
      });

      const playerBankAccountTransaction =
        await transaction.playerBankAccountTransaction.create({
          data: {
            type: 'DEPOSIT',
            amount,

            fromId: playerAccountId,
            toId: playerAccountId,
          },
        });
      const businessBankAccountTransaction =
        await transaction.businessBankAccountTransaction.create({
          data: {
            type: 'DEPOSIT',
            amount,

            fromId: businessAccountId,
            toId: businessAccountId,
          },
        });

      return [playerBankAccountTransaction, businessBankAccountTransaction] as [
        PlayerBankAccountTransaction,
        BusinessBankAccountTransaction,
      ];
    });
  }

  withdrawal(
    amount: Decimal,
    businessAccountId: string,
    playerAccountId: string,
  ): Promise<[BusinessBankAccountTransaction, PlayerBankAccountTransaction]> {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.businessBankAccount.update({
        data: {
          balance: { decrement: amount },
        },
        where: {
          id: businessAccountId,
          business: {
            owner: { account: { id: playerAccountId } },
          },
        },
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          'На банковском счёту Вашего бизнеса недостаточно средств',
        );

      await transaction.playerBankAccount.update({
        data: {
          balance: { increment: amount },
        },
        where: { id: playerAccountId },
      });

      const businessBankAccountTransaction =
        await transaction.businessBankAccountTransaction.create({
          data: {
            type: 'WITHDRAWAL',
            amount,

            fromId: businessAccountId,
            toId: businessAccountId,
          },
        });
      const playerBankAccountTransaction =
        await transaction.playerBankAccountTransaction.create({
          data: {
            type: 'WITHDRAWAL',
            amount,

            fromId: playerAccountId,
            toId: playerAccountId,
          },
        });

      return [businessBankAccountTransaction, playerBankAccountTransaction] as [
        BusinessBankAccountTransaction,
        PlayerBankAccountTransaction,
      ];
    });
  }

  transaction(
    type: BankAccountTransactionType,
    amount: Decimal,
    fromAccountId: string,
    toAccountId: string,
  ) {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.playerBankAccount.update({
        data: {
          balance: { decrement: amount },
        },
        where: { ownerId: fromAccountId },
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error('У Вас на счету недостаточно средств');

      await transaction.playerBankAccount.update({
        data: {
          ownerId: toAccountId,
          balance: { increment: amount },
        },
        where: { ownerId: toAccountId },
      });

      return transaction.playerBankAccountTransaction.create({
        data: {
          type,
          amount,

          fromId: fromAccountId,
          toId: toAccountId,
        },
      });
    });
  }

  // deposit(amount: number) {}
}
