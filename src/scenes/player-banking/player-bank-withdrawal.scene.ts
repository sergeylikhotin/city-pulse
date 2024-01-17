import { Goto, Label, On, Scene, Step, Wait } from '@grammy/decorators';
import { SceneContext } from '@grammy/grammy.context';
import { BusinessManagementService } from '../../domain/management/business-management/business-management.service';
import { MessageX } from '@grammyjs/hydrate/out/data/message';
import { BusinessBankingEntity } from '../../domain/entity/business-banking.entity';
import { PlayerBankingEntity } from '../../domain/entity/player-banking.entity';
import Decimal from 'decimal.js';
import { GrammyUserError } from '@grammy/grammy.user-error';

@Scene()
export class PlayerBankWithdrawalScene {
  constructor(
    private readonly businessManagementService: BusinessManagementService,

    private readonly playerBankingEntity: PlayerBankingEntity,
    private readonly businessBankingEntity: BusinessBankingEntity,
  ) {}

  @Step()
  async onSceneEnter(
    ctx: SceneContext<{
      menuMsg: MessageX;
    }>,
  ) {
    const businesses = await this.businessManagementService.getPlayerBusinesses(
      ctx.player.id,
    );
    if (businesses.length === 0) {
      ctx.scene.exit();
      return await ctx.reply(
        'Не найдены бизнесы с которых можно снять средства.',
      );
    }

    ctx.scene.session = {
      menuMsg: await ctx.replyMenu(
        'Выберите бизнес с которого Вы бы хотели снять средства:',
        [
          ...businesses.map((business) => [
            {
              text: `${business.asset.name}: ${business.name} (Баланс: ${business.account.balance})`,
              callback_data: business.id,
            },
          ]),
          [{ text: 'Отмена', callback_data: 'cancel' }],
        ],
      ),
    };
  }

  @Wait('BUSINESS_SELECTED')
  @On('callback_query:data')
  async onBusinessSelected(
    ctx: SceneContext<{
      menuMsg: MessageX;
      businessId: string;
    }>,
  ) {
    await ctx.answerCallbackQuery();
    await ctx.scene.session.menuMsg.delete();

    if (ctx.callbackQuery.data === 'cancel') {
      return ctx.scene.exit();
    }

    ctx.scene.session.businessId = ctx.callbackQuery.data;
    ctx.scene.resume();
  }

  @Label('AMOUNT_REQUEST')
  @Step()
  async onAmountRequest(ctx: SceneContext<{ menuMsg: MessageX }>) {
    ctx.scene.session.menuMsg = await ctx.replyMenu('Укажите сумму снятия.', [
      [{ text: 'Отмена', callback_data: 'cancel' }],
    ]);
  }

  @Wait('AMOUNT_RESPONSE')
  @On(['message:text', 'callback_query:data'])
  async onAmountResponse(
    ctx: SceneContext<{ menuMsg: MessageX; amount: string }>,
  ) {
    await ctx.scene.session.menuMsg.delete();

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      return ctx.scene.exit();
    }

    ctx.scene.session.amount = ctx.msg.text;
    ctx.scene.resume();
  }

  @Label('AMOUNT_VALIDATION')
  @Step()
  async onAmountValidation(
    ctx: SceneContext<{ businessId: string; amount: string }>,
  ) {
    let amount = new Decimal(0);

    try {
      amount = new Decimal(ctx.scene.session.amount);
    } catch (e) {
      return ctx.reply(
        `Уважаемый клиент! Извините, но банкомат не принимает '${ctx.msg.text}' для снятия средств. Он предпочитает обычные цифры, которые можно посчитать! Пожалуйста, введите настоящее число. С уважением, ваш Любящий Цифры Банк!`,
      );
    }

    if (amount.isNaN()) {
      return ctx.reply(
        `Уважаемый клиент! Мы искренне сожалеем, что Вы столкнулись с математической аномалией, пытаясь использовать 'NaN' как сумму для снятия средств. В нашем банке мы привыкли к цифрам, которые можно посчитать на пальцах. Предлагаем Вам выбрать более традиционное число. С уважением, ваш Банк Реальных Чисел`,
      );
    }
    if (!amount.isFinite()) {
      return ctx.reply(
        `Уважаемый клиент! Мы искренне сожалеем, но ${amount} - это слишком космическая сумма для нашего банка! Мы работаем с числами попроще, чтобы не вызвать коллапс вселенной. Попробуйте ввести число, которое можно увидеть на чеке, а не в теории относительности. С уважением, ваш Земной Банк!`,
      );
    }
    if (amount.isNegative()) {
      return ctx.reply(
        `Уважаемый клиент! К сожалению, наши банкоматы не умеют работать с отрицательными суммами. Они предпочитают держаться в плюсе! Пожалуйста, выберите положительное число для снятия средств. С уважением, ваш Положительный Банк!`,
      );
    }

    if (amount.isZero()) {
      return ctx.reply(
        `Уважаемый клиент! Похоже, Вы запросили снять сумму равную 0. Наш банк немного растерялся, так как обычно люди приходят за деньгами, а не за пустотой! Пожалуйста, введите число больше нуля, чтобы мы могли вам помочь. С уважением, ваш Ненулевой Банк!`,
      );
    }

    const { businessId } = ctx.scene.session;

    const businessAccount =
      await this.businessBankingEntity.getBankAccountByBusinessId(businessId);
    const playerAccount =
      await this.playerBankingEntity.getBankAccountByPlayerId(ctx.player.id);

    if (businessAccount.balance.minus(amount).isNegative()) {
      return ctx.reply(
        `Уважаемый клиент! Похоже, что желаемая сумма к снятию превышает баланс Вашего бизнеса. Наш банк умеет многое, но волшебства – не его сильная сторона! Пожалуйста, попробуйте сумму поменьше. С уважением, ваш Реалистичный Банк!`,
      );
    }

    try {
      await this.businessBankingEntity.withdrawal(
        businessAccount.id,
        playerAccount.id,
        amount,
      );
    } catch (e) {
      throw new GrammyUserError(
        `При попытке проведения транзакции произошла ошибка. Мы уже получили сообщение об ошибке и работаем над этим.`,
      );
    }

    await ctx.reply('Операция успешно проведена.');
    ctx.scene.exit();
  }

  @Label('AMOUNT_INVALID')
  @Goto('AMOUNT_REQUEST')
  onAmountInvalid() {}
}
