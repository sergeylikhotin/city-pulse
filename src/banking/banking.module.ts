import { Module } from '@nestjs/common';
import { PlayerBankingService } from './player/banking.service';
import { BusinessBankingService } from './business/banking.service';
import { BankingService } from './banking.service';

@Module({
  providers: [BankingService, PlayerBankingService, BusinessBankingService],
  exports: [PlayerBankingService, BusinessBankingService],
})
export class BankingModule {}
