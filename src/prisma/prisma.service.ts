import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  onApplicationBootstrap() {
    this.$connect();
  }

  onApplicationShutdown() {
    this.$disconnect();
  }
}
