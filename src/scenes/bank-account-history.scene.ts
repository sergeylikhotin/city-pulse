import { SceneBuilder } from '../interfaces/scene-builder';
import { Context } from '../../grammy/grammy.context';
import { Scene } from 'grammy-scenes';
import {
  GetBankAccountTransactionsQuery,
  GetBankAccountTransactionsQueryType,
} from '../../bank-account/queries/get-transactions.query';
import { BankAccountTransaction } from '@prisma/client';
import { BankAccountTransactionFull } from '../../bank-account/types/bank-account-transaction-full';

export const BANK_ACCOUNT_HISTORY_SCENE = 'BANK_ACCOUNT_HISTORY_SCENE';

export const BankAccountHistorySceneBuilder: SceneBuilder = () => {
  const scene = new Scene<Context>(BANK_ACCOUNT_HISTORY_SCENE);

  scene.step(async (ctx) => {
    const transactions = await ctx.queryBus.execute<
      GetBankAccountTransactionsQuery,
      BankAccountTransactionFull[]
    >(
      new GetBankAccountTransactionsQuery(
        ctx.player.account.id,
        GetBankAccountTransactionsQueryType.All,
      ),
    );

    await ctx.reply('История операций:');
    for (const { type, amount, createdAt, from, to } of transactions) {
      await ctx.reply(
        `${createdAt}\r\n[${type}] ${from?.player?.username ?? 'System'} -> ${to
          ?.player?.username}: <code>${amount}</code>`,
        { parse_mode: 'HTML' },
      );
    }
  });

  return scene;
};

/*@Scene()
class BankAccountHistoryScene {

  @Step()
  showHistory() {

  }
}*/
