import { Scene, Step } from '../../../../infrastructure/grammy/decorators';
import { SceneFlavoredContext } from 'grammy-scenes';
import { Context } from '../../../../infrastructure/grammy/grammy.context';
import { BusinessManagementService } from '../business-management.service';
import * as _ from 'lodash';

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

    const businessesGrouped = _.groupBy(businesses, 'type');
    for (const [name, businesses] of Object.entries(businessesGrouped)) {
      await ctx.reply(`${name}: ${businesses.length}`);
    }

    // for (const business of businesses) {
    //   await ctx.reply(
    //     `<b>${business.asset.name}</b>:\r\n${business.products
    //       .map(
    //         (product) =>
    //           `${product.asset.name}: ${product.quantity} ${product.asset.unit}.`,
    //       )
    //       .join('\r\n')}`,
    //     { parse_mode: 'HTML' },
    //   );
    // }
  }
}
