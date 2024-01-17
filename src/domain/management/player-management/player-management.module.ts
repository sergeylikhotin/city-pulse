import { Module } from '@nestjs/common';

import { PlayerManagementService } from './player-management.service';
import { RegistrationScene } from '../../../scenes/registration.scene';

import { EntityModule } from '../../entity/entity.module';

@Module({
  imports: [EntityModule],
  providers: [PlayerManagementService],
  exports: [PlayerManagementService],
})
export class PlayerManagementModule {}
