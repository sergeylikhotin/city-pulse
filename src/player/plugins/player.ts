import { Player } from '@prisma/client';
import { PluginHost } from '../../grammy/interfaces/plugin-host';
import { MiddlewareFn } from 'grammy';
import { PlayerService } from '../player.service';
import { Plugin } from "../../grammy/decorators";
import { Context } from '../../grammy/grammy.context';

export interface PlayerFlavor {
  player: Player;
}

@Plugin()
export class PlayerPlugin implements PluginHost<Context & PlayerFlavor> {
  constructor(private readonly playerService: PlayerService) {}

  middleware(): MiddlewareFn<Context & PlayerFlavor> {
    return async (ctx, next) => {
      ctx.player = await this.playerService.getPlayerByUserId(ctx.from.id);

      await next();
    };
  }
}
