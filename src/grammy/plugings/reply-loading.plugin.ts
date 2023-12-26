import { PluginHost } from '../interfaces/plugin-host';
import { Context } from '../grammy.context';
import { MiddlewareFn } from 'grammy';
import { MessageX } from '@grammyjs/hydrate/out/data/message';
import { Plugin } from '../decorators';

export type LoadedFn = () => Promise<void>;

export interface ReplyLoadingFlavor {
  replyLoading: (
    delayMs?: number,
    intervalMs?: number,
    loadingStates?: string[],
  ) => LoadedFn;
}

@Plugin()
export class ReplyLoading implements PluginHost<Context & ReplyLoadingFlavor> {
  middleware(): MiddlewareFn<Context & ReplyLoadingFlavor> {
    return async (ctx, next) => {
      ctx.replyLoading = (
        delayMs = 250,
        intervalMs = 500,
        loadingStates = ['Загрузка', 'Загрузка.', 'Загрузка..', 'Загрузка...'],
      ) => {
        let loadingMsg: MessageX;
        let loadingInterval: NodeJS.Timeout;
        const loadingTimeout = setTimeout(async () => {
          loadingMsg = await ctx.reply('Загрузка');

          let stateIndex = 0;
          const updateLoadingMessage = async () => {
            stateIndex = (stateIndex + 1) % loadingStates.length;
            await loadingMsg.editText(loadingStates[stateIndex]);
          };

          loadingInterval = setInterval(updateLoadingMessage, intervalMs);
        }, delayMs);
        return async () => {
          clearTimeout(loadingTimeout);
          clearInterval(loadingInterval);

          if (loadingMsg != null) {
            await loadingMsg.delete();
          }
        };
      };

      await next();
    };
  }
}
