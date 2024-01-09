import { Scene, Step } from "../infrastructure/grammy/decorators";
import { SceneContext } from "../infrastructure/grammy/grammy.context";
import { WelcomeScene } from "./welcome.scene";

@Scene()
export class MainScene {
  @Step()
  async onSceneEnter(ctx: SceneContext) {
    if (ctx.player == null) {
      return ctx.scene.call(WelcomeScene.name);
    }

    await ctx.reply(`Привет, ${ctx.player.username}!`);
  }
}
