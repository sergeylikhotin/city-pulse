import { Module } from '@nestjs/common';
import { MainScene } from './main.scene';

@Module({
  providers: [MainScene]
})
export class MainModule {}
