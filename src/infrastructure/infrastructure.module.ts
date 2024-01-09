import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { GrammyModule } from './grammy/grammy.module';
import { AssetsLoaderModule } from './assets-loader/assets-loader.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    PrismaModule,
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
  ],
})
export class InfrastructureModule {}
