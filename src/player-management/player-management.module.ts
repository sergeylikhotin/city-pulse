import { Module } from '@nestjs/common';
import { PlayerManagementService } from './player-management.service';
import { PlayerModule } from '../player/player.module';
import { PlayerRegistrationScene } from './scenes/player-registration.scene';
import { BankingModule } from '../banking/banking.module';

@Module({
  imports: [PlayerModule, BankingModule],
  providers: [PlayerManagementService, PlayerRegistrationScene],
})
export class PlayerManagementModule {}
