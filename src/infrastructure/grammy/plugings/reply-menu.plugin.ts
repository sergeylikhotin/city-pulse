import { PluginHost } from '../interfaces/plugin-host';
import { Context } from '../grammy.context';
import { MiddlewareFn } from 'grammy';
import { MessageX } from '@grammyjs/hydrate/out/data/message';
import { Plugin } from '../decorators';
import { InlineKeyboardButton } from 'grammy/types';

export interface MenuFlavor {
  replyMenu: (
    text: string,
    menu: InlineKeyboardButton[][],
  ) => Promise<MessageX>;
}

@Plugin()
export class ReplyMenuPlugin implements PluginHost<Context & MenuFlavor> {
  middleware(): MiddlewareFn<Context & MenuFlavor> {
    return async (ctx, next) => {
      ctx.replyMenu = async (text, menu) => {
        return ctx.reply(text, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: menu,
          },
        });
      };

      await next();
    };
  }
}
