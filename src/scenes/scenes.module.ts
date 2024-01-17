import { Module } from '@nestjs/common';

import { DomainModule } from '../domain/domain.module';

import { MainScene } from './main.scene';
import { WelcomeScene } from './welcome.scene';
import { RegistrationScene } from './registration.scene';
import { DebugCreateBusinessScene } from './debug-create-business.scene';
import { PlayerBusinessesScene } from './player-businesses.scene';

import { PlayerBankScene } from './player-banking/player-bank.scene';
import { PlayerBankWithdrawalScene } from './player-banking/player-bank-withdrawal.scene';
import { PlayerBankDepositScene } from './player-banking/player-bank-deposit.scene';

@Module({
  imports: [DomainModule],
  providers: [
    MainScene,
    WelcomeScene,

    // ------ Banking ------
    PlayerBankScene,
    PlayerBankWithdrawalScene,
    PlayerBankDepositScene,
    // ---------------------

    RegistrationScene,
    DebugCreateBusinessScene,
    PlayerBusinessesScene,
  ],
})
export class ScenesModule {}
