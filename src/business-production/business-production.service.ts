import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Business, Product, TimeUnitType } from '@prisma/client';
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
} from 'date-fns';

@Injectable()
export class BusinessProductionService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async production() {
    const businesses = await this.prisma.business.findMany({
      include: { products: true },
    });

    const products = businesses.reduce<Product[]>(
      (products, business) => products.concat(...business.products),
      [],
    );

    
  }

  calculateProductProduction(product: Product, targetTime: Date) {
    const productionTime = this.calculateTimeDifference(
      product.calculatedAt,
      targetTime,
      product.timeUnitType,
    );

    if (product.productionType === 'PRODUCIBLE') {
      return product.quantityPerTimeUnit.mul(productionTime);
    } else if (product.productionType === 'CONSUMABLE') {
      return product.quantityPerTimeUnit.mul(-productionTime);
    }

    return 0;
  }

  private calculateTimeDifference(
    lastCalcTime: Date,
    targetTime: Date,
    timeUnitType: TimeUnitType,
  ): number {
    switch (timeUnitType) {
      case TimeUnitType.HOUR:
        return differenceInHours(targetTime, lastCalcTime);
      case TimeUnitType.TWELVE_HOURS:
        return differenceInHours(targetTime, lastCalcTime) / 12;
      case TimeUnitType.DAY:
        return differenceInDays(targetTime, lastCalcTime);
      case TimeUnitType.THREE_DAYS:
        return differenceInDays(targetTime, lastCalcTime) / 3;
      case TimeUnitType.WEEK:
        return differenceInWeeks(targetTime, lastCalcTime);
      case TimeUnitType.TWO_WEEKS:
        return differenceInWeeks(targetTime, lastCalcTime) / 2;
      case TimeUnitType.MONTH:
        return differenceInMonths(targetTime, lastCalcTime);
      default:
        throw new Error(`Unsupported time unit type: ${timeUnitType}`);
    }
  }
}
