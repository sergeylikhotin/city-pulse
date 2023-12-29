import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as util from 'util';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor() {
    super();

    return Object.assign(
      this,
      this.$extends({
        query: {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;

            console.log(`${model}.${operation}: ${time}ms`);

            return result;
          },
        },
      }),
    );
  }
  onApplicationBootstrap() {
    this.$connect();
  }

  onApplicationShutdown() {
    this.$disconnect();
  }
}
