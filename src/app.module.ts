import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrammyModule } from './grammy/grammy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AssetsLoaderModule } from './assets-loader/assets-loader.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayerModule } from './data-modules/player/player.module';
import { BankingModule } from './data-modules/banking/banking.module';
import { BusinessModule } from './data-modules/business/business.module';
import { ProductModule } from './data-modules/product/product.module';
import { PlayerManagementModule } from './managment-modules/player-management/player-management.module';
import { BusinessManagementModule } from './managment-modules/business-management/business-management.module';
import { BusinessProductionModule } from './schedule/business-production/business-production.module';
import { MarketModule } from './data-modules/market/market.module';
import { MarketManagementModule } from './managment-modules/market-management/market-management.module';
import { ContractModule } from './data-modules/contract/contract.module';
import { ContractChatModule } from './data-modules/contract-chat/contract-chat.module';
import { ContractChatManagementModule } from './managment-modules/contract-chat-management/contract-chat-management.module';
import { ContractTermsModule } from './data-modules/contract-terms/contract-terms.module';
import { ContractTermsManagementModule } from './managment-modules/contract-terms-management/contract-terms-management.module';
import { WelcomeModule } from './scene-modules/welcome/welcome.module';
import { MainModule } from './scene-modules/main/main.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    GrammyModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        botToken: config.getOrThrow('BOT_TOKEN'),
        scenes: {
          debug: true,
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
      verboseMemoryLeak: true,
    }),

    AssetsLoaderModule,

    PlayerModule,
    BankingModule,

    BusinessModule,
    ProductModule,

    MarketModule,
    ContractModule,
    ContractTermsModule,
    ContractChatModule,

    PlayerManagementModule,
    BusinessManagementModule,
    BusinessProductionModule,
    MarketManagementModule,
    ContractTermsManagementModule,
    ContractChatManagementModule,
    WelcomeModule,
    MainModule,
  ],
  providers: [AppService],
})
export class AppModule {}
