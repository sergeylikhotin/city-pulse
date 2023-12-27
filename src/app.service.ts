import { Injectable, OnModuleInit } from '@nestjs/common';
import { GrammyService } from './grammy/grammy.service';
import { GrammyTestScene } from './grammy/grammy.test.scene';
import { DebugCreateBusinessScene } from './business-management/scenes/debug-create-business.scene';
import { PlayerBusinessesScene } from './business-management/scenes/player-businesses.scene';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly bot: GrammyService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    /*

    this.bot.command('start', async (ctx) => {
      await ctx.scenes.enter(START_SCENE);
    });

    this.bot.command('account', async (ctx) => {
      await ctx.scenes.enter(BANK_ACCOUNT_SCENE);
    });
    this.bot.command('delete_player', async (ctx) => {
      if (ctx.player == null) {
        return;
      }

      const player = await ctx.commandBus.execute<DeletePlayerCommand, Player>(
        new DeletePlayerCommand(ctx.player.id),
      );

      await ctx.reply(
        player != null
          ? `Учетная запись: ${player.username}, удалена!`
          : 'Ошибка.',
      );
    });
    this.bot.command('test', async (ctx) => {
      await ctx.reply(`На твоем счету ${ctx.player.account.amount} рублей.`);
    });

    this.bot.command('add', async (ctx) => {
      await ctx.reply(`На твоем счету ${ctx.player.account.amount} рублей.`);
    });*/

    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Проверить регистрацию' },
      {
        command: 'debug_create_business',
        description: 'Добавить тестовый бизнес',
      },
      { command: 'businesses', description: 'Список бизнесов' },
    ]);

    this.bot.command('start', async (ctx) => {
      await ctx.scenes.enter(GrammyTestScene.name);
      /*console.time('businesses');
      const businesses = await this.prisma.business.findMany({
        include: {
          // owner: true,
          products: true,
        },
      });
      console.timeEnd('businesses');

      await ctx.reply(
        `<pre language="JSON">${businesses.reduce(
          (acc, b) => acc + b.products.length,
          0,
        )}</pre>`,
        {
          parse_mode: 'HTML',
        },
      );*/
    });

    this.bot.command('debug_create_business', async (ctx) => {
      await ctx.scenes.enter(DebugCreateBusinessScene.name);
    });

    this.bot.command('businesses', async (ctx) => {
      await ctx.scenes.enter(PlayerBusinessesScene.name);
    });

    this.bot.run();
  }
}
