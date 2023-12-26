import { Module } from '@nestjs/common';
import { PlayerManagementService } from './player-management.service';

@Module({
  providers: [PlayerManagementService],
})
export class PlayerManagementModule {}
