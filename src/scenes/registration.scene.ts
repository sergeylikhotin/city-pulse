import {
  Label,
  On,
  Scene,
  Step,
  Wait,
} from '../infrastructure/grammy/decorators';
import { SceneFlavoredContext } from 'grammy-scenes';
import { Context } from '../infrastructure/grammy/grammy.context';
import { RegisterPlayerDto } from '../domain/managment/player-management/dto/register-player.dto';
import { Filter } from 'grammy';
import { PlayerManagementService } from '../domain/managment/player-management/player-management.service';
import { Player } from '@prisma/client';

@Scene()
export class RegistrationScene {
  constructor(
    private readonly playerManagementService: PlayerManagementService,
  ) {}

  @Step()
  async enterMessage(ctx: SceneFlavoredContext<Context, RegisterPlayerDto>) {
    if (ctx.player != null) {
      await ctx.reply('Вы уже зарегистрированы!');
      ctx.scene.exit();

      return;
    }

    ctx.scene.session = new RegisterPlayerDto();

    await ctx.reply('Регистрация:');
  }

  @Step()
  userId(ctx: SceneFlavoredContext<Context, RegisterPlayerDto>) {
    ctx.scene.session.userId = ctx.from.id;
  }

  @Label('REQUEST_USERNAME')
  @Step()
  async requestUsername(ctx: SceneFlavoredContext<Context, RegisterPlayerDto>) {
    await ctx.reply(
      'Пожалуйста, предоставьте имя вашей будущей учетной записи:',
    );
  }

  @Wait('USERNAME')
  @On('message:text')
  async onUsername(
    ctx: SceneFlavoredContext<
      Filter<Context, 'message:text'>,
      RegisterPlayerDto
    >,
  ) {
    const { text: username } = ctx.message;
    if (username.length < 3 || username.length > 64) {
      await ctx.reply(
        'Имя учетной записи должно быть не менее 3 символов и не более 64 символов.',
      );

      // ctx.scene.resume();
      ctx.scene.goto('REQUEST_USERNAME');
    } else {
      ctx.scene.session.username = username;
      ctx.scene.resume();
    }
  }

  @Label('REGISTRATION')
  @Step()
  async registration(ctx: SceneFlavoredContext<Context, RegisterPlayerDto>) {
    const registered = ctx.replyLoading(250, 500, [
      'Регистрация',
      'Регистрация.',
      'Регистрация..',
      'Регистрация...',
    ]);

    let player: Player;
    try {
      player = await this.playerManagementService.registerPlayer(
        ctx.scene.session,
      );
    } finally {
      await registered();
    }

    await ctx.reply(
      `Приветствую, ${player.username}. Ваша учетная запись успешно зарегистрирована.`,
    );

    ctx.scene.exit();
  }
}
