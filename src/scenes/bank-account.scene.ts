import { Context } from '../grammy/grammy.context';
import { Scene } from 'grammy-scenes';
import { MessageX } from '@grammyjs/hydrate/out/data/message';

export const BANK_ACCOUNT_SCENE = 'BANK_ACCOUNT_SCENE';
export const BankAccountSceneBuilder = () => {
  const scene = new Scene<Context, { menuMessage: MessageX }>(
    BANK_ACCOUNT_SCENE,
  );

  /*scene.step(async (ctx) => await ctx.reply('Твой банковский аккаунт:'));

  scene.label('start').step(async (ctx) => {
    const { amount } = await ctx.queryBus.execute<
      GetBankAccountByUserIdQuery,
      BankAccount
    >(new GetBankAccountByUserIdQuery(ctx.from.id));

    await ctx.reply(`Сумма на счету: ${amount}`);
  });
  scene.step(async (ctx) => {
    ctx.scene.session = {
      menuMessage: await ctx.reply('Выберете действие', {
        reply_markup: new InlineKeyboard()
          .text('Взять кредит', 'credit')
          .text('История операций', 'history')
          // .text('Отдать долг', 'debt')
          .text('Выйти', 'exit')
          .toTransposed(),
      }),
    };
  });

  scene.wait('menu').on('callback_query:data', async (ctx) => {
    await ctx.answerCallbackQuery();
    const { data } = ctx.callbackQuery;

    if (data === 'credit') {
      ctx.scene.call(BANK_ACCOUNT_CREDIT_SCENE);
    } else if (data === 'history') {
      ctx.scene.call(BANK_ACCOUNT_HISTORY_SCENE);
    } else if (data === 'exit') {
      ctx.scene.exit();
    }

    const { menuMessage } = ctx.scene.session;
    await ctx.api.deleteMessage(menuMessage.chat.id, menuMessage.message_id);
  });

  scene.label('loop').goto('start');*/

  return scene;
};
