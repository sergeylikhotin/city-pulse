import { Player } from '@prisma/client';
import { Plugin } from '../types/plugin';
import { Context, MiddlewareFn } from 'grammy';
import { Injectable } from '@nestjs/common';
import { PlayerService } from '../../player/player.service';

export interface PlayerFlavor {
  player: Player;
}

/*export const player =
  <C extends Context & CqrsFlavor>(): MiddlewareFn<C & PlayerFlavor> =>
  async (ctx, next) => {
    ctx.player = await ctx.queryBus.execute(
      new GetPlayerByUserIdQuery(ctx.from.id),
    );

    await next();
  };*/

@Injectable()
export class PlayerPlugin implements Plugin {
  constructor(private readonly playerService: PlayerService) {}

  middleware(): MiddlewareFn<Context & PlayerFlavor> {
    return async (ctx, next) => {
      ctx.player = await this.playerService.getPlayerByUserId(ctx.from.id);

      await next();
    };
  }
}
