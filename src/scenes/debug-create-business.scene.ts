import { SceneFlavoredContext } from 'grammy-scenes';
import { Business } from '@prisma/client';
import { Filter } from 'grammy';
import { Context, SceneContext } from '../infrastructure/grammy/grammy.context';
import {
  Label,
  On,
  Scene,
  Step,
  Wait,
} from '../infrastructure/grammy/decorators';
import { AssetsLoaderService } from '../infrastructure/assets-loader/assets-loader.service';

import { BusinessManagementService } from '../domain/management/business-management/business-management.service';
import { BusinessAsset } from '../infrastructure/assets-loader/types/business.asset';

@Scene()
export class DebugCreateBusinessScene {
  constructor(
    private readonly businessManagementService: BusinessManagementService,
    private readonly assetsLoaderService: AssetsLoaderService,
  ) {}

  @Label('REQUEST_BUSINESS_TYPE')
  @Step()
  async requestBusinessType(ctx: SceneContext) {
    ctx.scene.session = {};

    await ctx.reply('Введите тип бизнеса или /exit для выхода:');
  }

  @Wait('WAIT_BUSINESS_TYPE')
  @On('message:text')
  async onBusinessType(ctx: SceneContext<{ asset: BusinessAsset }>) {
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

    ctx.scene.session.asset = asset;
    ctx.scene.resume();
  }

  @Label('REQUEST_BUSINESS_COUNT')
  @Step()
  async requestBusinessCount(ctx: SceneFlavoredContext<Context, unknown>) {
    await ctx.reply(
      'Введите кол-во бизнесов которые необходимо создать или /exit для выхода:',
    );
  }

  @Wait('WAIT_BUSINESS_COUNT')
  @On('message:text')
  async onBusinessCount(
    ctx: SceneContext<{ asset: BusinessAsset; count: number }>,
  ) {
    const { text } = ctx.msg;
    if (text === '/exit') {
      await ctx.reply(`Выход.`);
      return ctx.scene.exit();
    }

    const count = parseFloat(text);
    if (isNaN(count) || count <= 0 || count > 1000) {
      await ctx.reply(`${text} не является валидным числом`);
      return ctx.scene.goto('REQUEST_BUSINESS_COUNT');
    }

    ctx.scene.session.count = count;
    ctx.scene.resume();
  }

  @Step()
  async createBusiness(
    ctx: SceneContext<{ asset: BusinessAsset; count: number }>,
  ) {
    const { asset, count } = ctx.scene.session;

    const created = ctx.replyLoading();

    const businesses: Business[] = [];
    try {
      for (let i = 0; i < count; i++) {
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
  }

  @Step()
  async businessCreated(ctx: SceneFlavoredContext<Context, unknown>) {
    const businesses: Business[] = ctx.scene.arg;

    await ctx.reply(`Создано ${businesses.length} бизнесов!`);
    // await ctx.reply(`Бизнес создан! Идентификаторы: ${business.id}`);
  }
}
