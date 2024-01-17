import { Player } from '@prisma/client';
import { MiddlewareFn } from 'grammy';
import { PlayerEntity } from './player.entity';
import { PluginHost } from '../../infrastructure/grammy/interfaces/plugin-host';
import { Plugin } from '../../infrastructure/grammy/decorators';
import { Context } from '../../infrastructure/grammy/grammy.context';

export interface PlayerFlavor {
  player: Player;
}

@Plugin()
export class PlayerPlugin implements PluginHost<Context & PlayerFlavor> {
  constructor(private readonly playerEntity: PlayerEntity) {}

  middleware(): MiddlewareFn<Context & PlayerFlavor> {
    return async (ctx, next) => {
      ctx.player = await this.playerEntity.getPlayerByUserId(ctx.from.id);

      await next();
    };
  }
}
