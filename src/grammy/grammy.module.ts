import { Module } from '@nestjs/common';
import { GrammyService } from './grammy.service';

@Module({
  providers: [GrammyService]
})
export class GrammyModule {}
