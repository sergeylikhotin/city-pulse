import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';

@Module({
  providers: [BusinessService]
})
export class BusinessModule {}
