import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { GrammyUserError } from '../grammy/grammy.user-error';
import { PlayerBankingService } from '../banking/player/banking.service';

@Injectable()
export class PlayerManagementService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly playerBankingService: PlayerBankingService,
  ) {}

  async registerPlayer(dto: RegisterPlayerDto) {
    let player = await this.playerService.getPlayerByUserId(dto.userId);
    if (player != null) {
      throw new GrammyUserError('Пользователь уже зарегистрирован!');
    }

    player = await this.playerService.createPlayer(dto);

    await this.playerBankingService.createBankAccount(player.id);

    return player;
  }
}
