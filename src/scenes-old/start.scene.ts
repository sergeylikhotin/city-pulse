import { Context } from '../infrastructure/grammy/grammy.context';
import { Scene } from 'grammy-scenes';

export const START_SCENE = 'START_SCENE';

export const StartSceneBuilder = () => {
  const scene = new Scene<Context>(START_SCENE);

  /*scene.step(async (ctx) => {
    if (ctx.player != null) {
      await ctx.reply(
        `Привет, ${ctx.player.username}.\r\nТвой аккаунт создан: ${ctx.player.createdAt}.`,
      );

      return ctx.scene.exit();
    }
  });

  scene.step((ctx) =>
    ctx.reply(
      `Привет, ${ctx.from.first_name}. Ты попал в лучшую игру тысячелетия, City Pulse.`,
    ),
  );

  scene.step((ctx) =>
    ctx.reply(
      `Давай создадим тебе учетную запись, пожалуйста, выбери имя для своей учетную записи внутри игры:`,
    ),
  );

  scene.wait('username').on('message:text', async (ctx) => {
    const { text: username } = ctx.message;

    if (username.length < 3 || username.length >= 64) {
      return await ctx.reply(
        'Имя должно быть не менее 3 символов и не более 64 символов в длину.',
      );
    }

    const loaded = ctx.replyLoading();

    const { id: userId } = ctx.from;
    const player = await ctx.commandBus.execute<CreatePlayerCommand, Player>(
      new CreatePlayerCommand(userId, username),
    );

    await ctx.reply(`Учетная запись создана, открываем банковский счёт...`);

    const bankAccount = await ctx.commandBus.execute<
      CreateBankAccountCommand,
      BankAccount
    >(new CreateBankAccountCommand(player.id));

    await loaded();

    await ctx.reply(`Банковский счёт открыт!`);
    await ctx.reply(
      `Идентификатор учетной записи: <code>${player.id}</code>.\r\nИдентификатор счёта: <code>${bankAccount.id}</code>.`,
      {
        parse_mode: 'HTML',
      },
    );
    await ctx.reply(
      `Теперь ожидай пока разработчик реализует остальной функционал`,
    );

    ctx.scene.resume();
  });*/

  return scene;
};
