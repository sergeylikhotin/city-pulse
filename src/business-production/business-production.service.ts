import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import {
  Business,
  Product,
  ProductProductionType,
  TimeUnitType,
} from '@prisma/client';
import { chunk } from 'lodash';

@Injectable()
export class BusinessProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.production();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async production() {
    const currentDate = new Date();
    const businesses = await this.prisma.business.findMany({
      include: { products: true },
    });
    // const products = await this.prisma.product.findMany();

    const chunks = chunk(businesses, 250);

    console.time('businesses production');
    for (let i = 0; i < chunks.length; i++) {
      const businessesChunk = chunks[i];

      // console.log(`Chunk ${i + 1}`);
      await this.batchCalcAndSave(currentDate, businessesChunk);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log(`End of chunk ${i + 1}`);
    }
    console.timeEnd('businesses production');
  }

  private async batchCalcAndSave(
    currentDate: Date,
    businesses: (Business & { products: Product[] })[],
  ) {
    // console.time('product calculation and saving');
    const recalculateBusinessesPromises = businesses
      .map((business) =>
        business.products.map((product) =>
          this.prisma.product.update({
            data: {
              calculatedAt: currentDate,
              quantity: {
                increment: this.calculateQuantityChange(product, currentDate),
              },
            },
            where: { id: product.id },
          }),
        ),
      )
      .flat();

    /*const recalculateBusinessesPromises = businesses.map((business) =>
      this.prisma.business.update({
        data: {
          products: {
            update: business.products.map((product) => ({
              data: {
                calculatedAt: currentDate,
                quantity: {
                  increment: this.calculateQuantityChange(product, currentDate),
                },
              },
              where: { id: product.id },
            })),
          },
        },
        where: { id: business.id },
      }),
    );*/

    const recalculatedBusinesses = await this.prisma.$transaction(
      recalculateBusinessesPromises,
    );

    // const recalculatedBusinesses = await Promise.all(
    //   recalculateBusinessesPromises,
    // );

    // console.timeEnd('product calculation and saving');
    // console.log(`businesses recalculated: ${recalculatedBusinesses.length}`);
  }

  private calculateTimeDifference(
    lastCalcTime: Date,
    targetTime: Date,
    timeUnitType: TimeUnitType,
  ): number {
    const elapsedTime = targetTime.getTime() - lastCalcTime.getTime();

    switch (timeUnitType) {
      case TimeUnitType.HOUR:
        return elapsedTime / 3600000;
      case TimeUnitType.TWELVE_HOURS:
        return elapsedTime / 3600000 / 12;
      case TimeUnitType.DAY:
        return elapsedTime / 3600000 / 24;
      case TimeUnitType.THREE_DAYS:
        return elapsedTime / 3600000 / 24 / 3;
      case TimeUnitType.WEEK:
        return elapsedTime / 3600000 / 24 / 7;
      case TimeUnitType.TWO_WEEKS:
        return elapsedTime / 3600000 / 24 / 7 / 2;
      case TimeUnitType.MONTH:
        return elapsedTime / 3600000 / 24 / 30;
      default:
        throw new Error(`Unsupported time unit type: ${timeUnitType}`);
    }
  }

  private calculateQuantityChange(product: Product, currentData: Date): number {
    const elapsedTimeUnits = this.calculateTimeDifference(
      product.calculatedAt,
      currentData,
      product.timeUnitType,
    );
    const quantityChange = elapsedTimeUnits * product.quantityPerTimeUnit;

    if (product.productionType === 'PRODUCIBLE') {
      return quantityChange;
    } else if (product.productionType === 'CONSUMABLE') {
      return -quantityChange;
    } else {
      throw new Error(`Unsupported production type: ${product.timeUnitType}`);
    }
  }
}
