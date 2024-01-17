import * as _ from 'lodash';

import {
  CallbackQuery,
  Goto,
  Label,
  On,
  Scene,
  Step,
  Wait,
} from '../infrastructure/grammy/decorators';
import { SceneContext } from '../infrastructure/grammy/grammy.context';
import { GrammyUserError } from '../infrastructure/grammy/grammy.user-error';

import { WelcomeScene } from './welcome.scene';
import { MessageX } from '@grammyjs/hydrate/out/data/message';
import { PlayerBankScene } from "./player-banking/player-bank.scene";

type MenuItem = {
  text: string;
  callback_data: string;

  scene: (new (...args: any) => any) | string;
};

@Scene()
export class MainScene {
  private readonly menu: MenuItem[] = [
    { text: 'Банк', callback_data: 'bank', scene: PlayerBankScene },
    /*{ text: 'Бизнес', callback_data: 'business', scene: PlayerBusinessesScene },
    { text: 'Рынок', callback_data: 'market', scene: 'MarketScene' },
    { text: 'Чаты', callback_data: 'chats', scene: 'ChatsScene' },
    {
      text: 'Уведомления',
      callback_data: 'notifications',
      scene: 'NotificationsScene',
    },*/
    { text: 'Настройки', callback_data: 'settings', scene: 'SettingsScene' },
  ];

  @Step()
  async onSceneEnter(ctx: SceneContext) {
    if (ctx.player == null) {
      return ctx.scene.call(WelcomeScene.name);
    }

    await ctx.reply(`Привет, ${ctx.player.username}!`);
  }

  @Label('MENU')
  @Step()
  async onMenu(ctx: SceneContext<MessageX>) {
    /*ctx.scene.session = await ctx.reply('<b>Меню</b>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          ..._.chunk(this.menu, 2),
          [{ text: 'Помощь', callback_data: 'help' }],
        ],
      },
    });*/
    ctx.scene.session = await ctx.replyMenu('<b>Меню</b>', [
      ..._.chunk(this.menu, 2),
      [{ text: 'Помощь', callback_data: 'help' }],
    ]);
  }

  @Wait('MENU_RESPONSE')
  @On('callback_query:data')
  async onMenuCallbackQuery(ctx: SceneContext<MessageX>) {
    await ctx.answerCallbackQuery();
    await ctx.scene.session.delete();

    const data = ctx.callbackQuery.data;
    const menuItem = this.menu.find(
      ({ callback_data }) => callback_data === data,
    );

    if (menuItem == null) {
      throw new GrammyUserError('Пункт меню не найден.');
    }

    console.log(menuItem);

    if (typeof menuItem.scene === 'string') {
      ctx.scene.call(menuItem.scene);
    } else {
      ctx.scene.call(menuItem.scene.name);
    }
  }

  @Label('MENU_LOOP')
  @Goto('MENU')
  gotoMenu() {}
}
