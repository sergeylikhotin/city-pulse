import { Context } from '../infrastructure/grammy/grammy.context';
import { Scene } from 'grammy-scenes';

export const BANK_ACCOUNT_HISTORY_SCENE = 'BANK_ACCOUNT_HISTORY_SCENE';

export const BankAccountHistorySceneBuilder = () => {
  const scene = new Scene<Context>(BANK_ACCOUNT_HISTORY_SCENE);

  // scene.wait('123').on('message:text', (ctx, next) => )

  /*scene.step(async (ctx) => {
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
  });*/

  return scene;
};
