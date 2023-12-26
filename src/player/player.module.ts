import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerPlugin } from './plugins/player';

@Module({
  providers: [PlayerService, PlayerPlugin],
  exports: [PlayerService],
})
export class PlayerModule {}
