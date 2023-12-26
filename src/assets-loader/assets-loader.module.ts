import { Module } from '@nestjs/common';
import { AssetsLoaderService } from './assets-loader.service';

@Module({
  providers: [AssetsLoaderService]
})
export class AssetsLoaderModule {}
