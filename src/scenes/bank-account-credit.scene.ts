import { SceneBuilder } from '../interfaces/scene-builder';
import { Context } from '../../grammy/grammy.context';
import { Scene } from 'grammy-scenes';
import { CreditBankAccountCommand } from '../../bank-account/commands/credit.command';
import { player } from '../../grammy/plugings/player';
import { BankAccountTransaction } from '@prisma/client';

export const BANK_ACCOUNT_CREDIT_SCENE = 'BANK_ACCOUNT_CREDIT_SCENE';

export const BankAccountCreditSceneBuilder: SceneBuilder = () => {
  const scene = new Scene<Context>(BANK_ACCOUNT_CREDIT_SCENE);

  scene.step(
    async (ctx) => await ctx.reply('Какую сумму вы бы хотели взять в кредит?'),
  );

  scene.wait('credit').on('message:text', async (ctx) => {
    const { text } = ctx.message;
    const amount = parseFloat(text);

    if (isNaN(amount)) {
      return await ctx.reply('Введите число!');
    }

    const transaction = await ctx.commandBus.execute<
      CreditBankAccountCommand,
      BankAccountTransaction
    >(new CreditBankAccountCommand(ctx.player.account.id, amount));

    await ctx.reply(`Вам выдан кредит на ${transaction.amount}`);

    ctx.scene.resume();
  });

  return scene;
};
