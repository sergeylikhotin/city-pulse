import { Context } from './grammy.context';
import { Call, Command, Exit, Label, Scene, Step, Wait } from './decorators';
import { SceneFlavoredContext, ScenesSessionData } from 'grammy-scenes';
import { PlayerRegistrationScene } from "../managment-modules/player-management/scenes/player-registration.scene";

@Scene()
export class GrammyTestScene {
  @Step()
  async hello(ctx: SceneFlavoredContext<Context, ScenesSessionData>) {
    await ctx.reply('Привет! Это сцена собрана целиком из декораторов!');
  }

  @Step()
  async registrationChecking(
    ctx: SceneFlavoredContext<Context, ScenesSessionData>,
  ) {
    await ctx.reply(`И так, проверим зарегистрирован ли ты...`);

    if (ctx.player) {
      await ctx.reply(`Да! Твое имя: ${ctx.player.username}`);

      return ctx.scene.exit();
    } else {
      await ctx.reply(
        'О нет, мы тебя еще не зарегистрировали, подожди пока я реализую сцену регистрации',
      );
    }

    ctx.scene.resume();
  }

  @Label('REGISTRATION')
  @Call(PlayerRegistrationScene.name)
  registration() {}

  @Label('EXIT')
  @Step()
  exit() {}
}
