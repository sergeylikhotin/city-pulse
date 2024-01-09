import {
  Command,
  Scene,
  Step,
  Wait,
} from '../infrastructure/grammy/decorators';
import { SceneContext } from '../infrastructure/grammy/grammy.context';
import { RegistrationScene } from './registration.scene';

@Scene()
export class WelcomeScene {
  private readonly features = [
    `🏦 <b>Управление финансами:</b> Просматривайте свои счета и осуществляйте финансовые операции.`,
    `💼 <b>Развитие бизнеса:</b> Исследуйте возможности для покупки и управления бизнесами.`,
    `📈 <b>Торговля на рынке:</b> Участвуйте в рыночных сделках, создавайте и отвечайте на предложения.`,
    `🤝 <b>Переговоры и контракты:</b> Согласовывайте детали контрактов и управляйте ими.`,
  ];

  @Step()
  async onSceneEnter(ctx: SceneContext) {
    await ctx.reply('🌟 Добро пожаловать в CityPulse! 🌟');
    await ctx.reply(
      `Откройте для себя мир бизнес-стратегии, где вы можете управлять собственным бизнесом, вести торговлю на рынке и заключать выгодные контракты.\r\nВас ждет:`,
    );
    await ctx.reply(this.features.map((feat) => `• ${feat}`).join('\r\n'), {
      parse_mode: 'HTML',
    });

    await ctx.reply(
      'Чтобы начать, пожалуйста, зарегистрируйтесь с помощью команды /register.',
    );

    await ctx.reply(
      'Если вам понадобится помощь, используйте команду /help.\r\n\r\nПора начать строить свою экономическую империю в мире City Pulse! 🚀',
    );
  }

  @Wait('REGISTER_COMMAND')
  @Command('register')
  async onRegisterCommand(ctx: SceneContext) {
    ctx.scene.call(RegistrationScene.name);
  }

  // @Label('REGISTRATION_END')
  // onRegistrationEnd() {}
}
