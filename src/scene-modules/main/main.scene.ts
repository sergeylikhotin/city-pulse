import { Scene, Step } from '../../grammy/decorators';
import { SceneContext } from '../../grammy/grammy.context';
import { WelcomeScene } from '../welcome/welcome.scene';

@Scene()
export class MainScene {
  @Step()
  onSceneEnter(ctx: SceneContext) {
    if (ctx.player == null) {
      return ctx.scene.call(WelcomeScene.name);
    }
  }
}
