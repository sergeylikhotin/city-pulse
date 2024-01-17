import { Goto, Label, On, Scene, Step, Wait } from '@grammy/decorators';
import { SceneContext } from '@grammy/grammy.context';
import { MessageX } from '@grammyjs/hydrate/out/data/message';
import { GrammyUserError } from '@grammy/grammy.user-error';

import { PlayerBankingEntity } from '../../domain/entity/player-banking.entity';

import { format } from '../utils/transaction';
import { PlayerBankWithdrawalScene } from './player-bank-withdrawal.scene';
import { PlayerBankDepositScene } from './player-bank-deposit.scene';

@Scene()
export class PlayerBankScene {
  constructor(private readonly playerBankingEntity: PlayerBankingEntity) {}

  @Label('BANK')
  @Step()
  async onBankEnter(ctx: SceneContext) {
    if (ctx.player == null) {
      throw new GrammyUserError('Учетная запись не найдена!');
    }

    ctx.scene.session = {};

    await ctx.reply('🏦 Ваш банковский счёт:');
  }

  @Label('BALANCE')
  @Step()
  async onBalance(ctx: SceneContext) {
    const loaded = ctx.replyLoading();
    const account = await this.playerBankingEntity.getBankAccountByPlayerId(
      ctx.player.id,
    );
    if (account == null) {
      await loaded();

      throw new GrammyUserError(
        'Банковский счет для вашей учетной записи не найден, пожалуйста, обратитесь в службу поддержки!',
      );
    }

    const transactions =
      await this.playerBankingEntity.getBankAccountTransactions(account.id);
    await loaded();

    await ctx.reply(`💰 Баланс: ${account.balance}`);
    await ctx.reply(
      `📜 Последние 10 операций: \r\n${
        transactions
          .slice(0, 10)
          .map((transaction, i) => `${i + 1}. ${format(transaction)}`)
          .join('\r\n') || 'Операций не найдено.'
      }`,
    );
  }

  @Label('MENU')
  @Step()
  async onMenu(ctx: SceneContext<{ menuMsg: MessageX }>) {
    ctx.scene.session.menuMsg = await ctx.replyMenu(
      '<b>Доступные операции</b>',
      [
        // [{ text: 'Просмотреть все операции', callback_data: 'history' }],
        [
          { text: 'Внести на счёт', callback_data: 'withdrawal' },
          { text: 'Снять со счета', callback_data: 'deposit' },
        ],
        [{ text: 'Перевод', callback_data: 'transfer' }],
        [{ text: 'Назад', callback_data: 'exit' }],
      ],
    );
  }

  @Wait('MENU_RESPONSE')
  @On('callback_query:data')
  async onMenuCallbackQuery(ctx: SceneContext<{ menuMsg: MessageX }>) {
    await ctx.answerCallbackQuery();
    await ctx.scene.session.menuMsg.delete();

    switch (ctx.callbackQuery.data) {
      case 'withdrawal':
        return ctx.scene.call(PlayerBankWithdrawalScene.name);
      case 'deposit':
        return ctx.scene.call(PlayerBankDepositScene.name);
      case 'transfer':
        await ctx.reply(
          'Мы искренне сожалеем, но переводы между счетами игроков на текущий момент недоступны.',
        );
        break;
      case 'exit':
        return ctx.scene.exit();
    }

    ctx.scene.resume();
  }

  @Label('MENU_LOOP')
  @Goto('BALANCE')
  menuLoop() {}
}
