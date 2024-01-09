import { Module } from '@nestjs/common';

import { EntityModule } from '../../entity/entity.module';
import { BusinessManagementService } from './business-management.service';

import { DebugCreateBusinessScene } from './scenes/debug-create-business.scene';
import { PlayerBusinessesScene } from './scenes/player-businesses.scene';

@Module({
  imports: [EntityModule],
  providers: [
    BusinessManagementService,
    DebugCreateBusinessScene,
    PlayerBusinessesScene,
  ],
})
export class BusinessManagementModule {}
