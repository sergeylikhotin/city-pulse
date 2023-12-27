import { Scene, Step } from '../../grammy/decorators';
import { SceneFlavoredContext } from 'grammy-scenes';
import { Context } from '../../grammy/grammy.context';
import { BusinessManagementService } from '../business-management.service';

@Scene()
export class PlayerBusinessesScene {
  constructor(
    private readonly businessManagementService: BusinessManagementService,
  ) {}

  @Step()
  async onSceneEnter(ctx: SceneFlavoredContext<Context, unknown>) {
    await ctx.reply('Список бизнесов: ');

    const businesses = await this.businessManagementService.getPlayerBusinesses(
      ctx.player.id,
    );

    for (const business of businesses) {
      await ctx.reply(
        `<b>${business.asset.name}</b>:\r\n${business.products
          .map(
            (product) =>
              `${product.asset.name}: ${product.quantity} ${product.asset.unit}.`,
          )
          .join('\r\n')}`,
        { parse_mode: 'HTML' },
      );
    }
  }
}
