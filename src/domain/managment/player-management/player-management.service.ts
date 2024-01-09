import { Injectable } from '@nestjs/common';

import { GrammyUserError } from '../../../infrastructure/grammy/grammy.user-error';

import { PlayerEntity } from '../../entity/player.entity';
import { PlayerBankingEntity } from '../../entity/player-banking.entity';

import { RegisterPlayerDto } from './dto/register-player.dto';

@Injectable()
export class PlayerManagementService {
  constructor(
    private readonly playerEntity: PlayerEntity,
    private readonly playerBankingEntity: PlayerBankingEntity,
  ) {}

  async registerPlayer(dto: RegisterPlayerDto) {
    let player = await this.playerEntity.getPlayerByUserId(dto.userId);
    if (player != null) {
      throw new GrammyUserError('Пользователь уже зарегистрирован!');
    }

    player = await this.playerEntity.createPlayer(dto);

    await this.playerBankingEntity.createBankAccount(player.id);

    return player;
  }
}
