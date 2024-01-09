import { Injectable } from "@nestjs/common";
import { BusinessBankAccountTransaction, PlayerBankAccountTransaction, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";

@Injectable()
export class BankingEntity {
  constructor(private readonly prisma: PrismaService) {
  }

  deposit(
    playerAccountId: string,
    businessAccountId: string,
    amount: Decimal
  ): Promise<[PlayerBankAccountTransaction, BusinessBankAccountTransaction]> {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.playerBankAccount.update({
        data: {
          balance: { decrement: amount }
        },
        where: { id: playerAccountId }
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          "На банковском счёту Вашей учетной записи недостаточно средств"
        );

      await transaction.businessBankAccount.update({
        data: {
          balance: { increment: amount }
        },
        where: {
          id: businessAccountId,
          business: {
            owner: { account: { id: playerAccountId } }
          }
        }
      });

      const playerBankAccountTransaction =
        await transaction.playerBankAccountTransaction.create({
          data: {
            type: "DEPOSIT",
            amount,

            fromId: playerAccountId,
            toId: playerAccountId
          }
        });
      const businessBankAccountTransaction =
        await transaction.businessBankAccountTransaction.create({
          data: {
            type: "DEPOSIT",
            amount,

            fromId: businessAccountId,
            toId: businessAccountId
          }
        });

      return [playerBankAccountTransaction, businessBankAccountTransaction] as [
        PlayerBankAccountTransaction,
        BusinessBankAccountTransaction,
      ];
    });
  }

  withdrawal(
    businessAccountId: string,
    playerAccountId: string,
    amount: Decimal
  ): Promise<[BusinessBankAccountTransaction, PlayerBankAccountTransaction]> {
    return this.prisma.$transaction(async (transaction: PrismaClient) => {
      const fromBankAccount = await transaction.businessBankAccount.update({
        data: {
          balance: { decrement: amount }
        },
        where: {
          id: businessAccountId,
          business: {
            owner: { account: { id: playerAccountId } }
          }
        }
      });
      if (fromBankAccount.balance.lessThan(0))
        throw new Error(
          "На банковском счёту Вашего бизнеса недостаточно средств"
        );

      await transaction.playerBankAccount.update({
        data: {
          balance: { increment: amount }
        },
        where: { id: playerAccountId }
      });

      const businessBankAccountTransaction =
        await transaction.businessBankAccountTransaction.create({
          data: {
            type: "WITHDRAWAL",
            amount,

            fromId: businessAccountId,
            toId: businessAccountId
          }
        });
      const playerBankAccountTransaction =
        await transaction.playerBankAccountTransaction.create({
          data: {
            type: "WITHDRAWAL",
            amount,

            fromId: playerAccountId,
            toId: playerAccountId
          }
        });

      return [businessBankAccountTransaction, playerBankAccountTransaction] as [
        BusinessBankAccountTransaction,
        PlayerBankAccountTransaction,
      ];
    });
  }

  // deposit(amount: number) {}
}
