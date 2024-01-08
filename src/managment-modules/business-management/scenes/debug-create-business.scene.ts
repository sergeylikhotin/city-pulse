import {
  Command,
  Label,
  On,
  Scene,
  Step,
  Wait,
} from '../../../grammy/decorators';
import { SceneFlavoredContext } from 'grammy-scenes';
import { Context } from '../../../grammy/grammy.context';
import { BusinessManagementService } from '../business-management.service';
import { Business } from '@prisma/client';
import { Filter } from 'grammy';
import { AssetsLoaderService } from '../../../assets-loader/assets-loader.service';

@Scene()
export class DebugCreateBusinessScene {
  constructor(
    private readonly businessManagementService: BusinessManagementService,
    private readonly assetsLoaderService: AssetsLoaderService,
  ) {}

  @Label('REQUEST_BUSINESS_TYPE')
  @Step()
  async requestBusinessType(ctx: SceneFlavoredContext<Context, unknown>) {
    await ctx.reply('Введите тип бизнеса или /exit для выхода:');
  }

  @Wait('WAIT_BUSINESS_TYPE')
  @On('message:text')
  async onSceneEnter(
    ctx: SceneFlavoredContext<Filter<Context, 'message:text'>, unknown>,
  ) {
    const { text: type } = ctx.msg;
    if (type === '/exit') {
      await ctx.reply(`Выход.`);
      return ctx.scene.exit();
    }

    const asset = this.assetsLoaderService.getBusinessAsset(type);
    if (asset == null) {
      await ctx.reply(`Бизнес ${type} не найден.`);
      return ctx.scene.goto('REQUEST_BUSINESS_TYPE');
    }

    const created = ctx.replyLoading();

    const businesses: Business[] = [];
    try {
      for (let i = 0; i < 1000; i++) {
        businesses.push(
          await this.businessManagementService.debugCreateBusiness(
            ctx.player.id,
            asset.type,
          ),
        );
      }
    } finally {
      await created();
    }

    ctx.scene.next_arg = businesses;
    ctx.scene.resume();
  }

  @Step()
  async businessCreated(ctx: SceneFlavoredContext<Context, unknown>) {
    const businesses: Business[] = ctx.scene.arg;

    await ctx.reply(`Создано ${businesses.length} бизнесов!`);
    // await ctx.reply(`Бизнес создан! Идентификаторы: ${business.id}`);
  }
}
