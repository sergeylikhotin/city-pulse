import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GrammyModule } from './grammy/grammy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlayerManagementModule } from './player-management/player-management.module';
import { BankingModule } from './banking/banking.module';
import { BusinessModule } from './business/business.module';
import { ProductModule } from './product/product.module';
import { AssetsLoaderModule } from './assets-loader/assets-loader.module';
import { BusinessManagementModule } from './business-management/business-management.module';
import { BusinessProductionModule } from './business-production/business-production.module';

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

    PlayerModule,
    BankingModule,
    BusinessModule,
    ProductModule,

    PlayerManagementModule,

    AssetsLoaderModule,

    BusinessManagementModule,

    BusinessProductionModule,
  ],
  providers: [AppService],
})
export class AppModule {}
