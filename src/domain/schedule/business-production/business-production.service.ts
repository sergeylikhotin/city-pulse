import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { Prisma, Product, ProductProductionType, TimeUnitType } from "@prisma/client";
import { chunk } from "lodash";

type BusinessWithProducts = Prisma.BusinessGetPayload<{
  include: { products: true };
}>;
type RecalculatedProduct = {
  id: string;

  calculatedAt: Date;
  quantityChange: number;
};

@Injectable()
export class BusinessProductionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async onModuleInit() {
    // await this.production();
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async production() {
    const currentDate = new Date();
    const businesses = await this.prisma.business.findMany({
      include: { products: true }
    });

    const chunks = chunk(businesses, 250);

    performance.mark("businesses production start");
    for (let i = 0; i < chunks.length; i++) {
      const businessesChunk = chunks[i];

      const recalculatedProducts = this.recalculateBusinessesProducts(
        currentDate,
        businessesChunk
      );

      await this.saveRecalculatedProducts(recalculatedProducts);
    }
    performance.mark("businesses production end");

    const measure = performance.measure(
      "businesses production",
      "businesses production start",
      "businesses production end"
    );

    console.dir(measure);
  }

  private async saveRecalculatedProducts(
    recalculatedProducts: RecalculatedProduct[]
  ) {
    await this.prisma.$transaction(
      recalculatedProducts.map(({ id, calculatedAt, quantityChange }) =>
        this.prisma.product.update({
          data: {
            quantity: {
              increment: quantityChange
            },
            calculatedAt: calculatedAt
          },
          where: { id }
        })
      )
    );
  }

  private recalculateBusinessesProducts(
    currentDate: Date,
    businesses: BusinessWithProducts[]
  ): RecalculatedProduct[] {
    return businesses
      .filter(
        (business) =>
          !business.products.some(
            (product) =>
              product.type === ProductProductionType.CONSUMABLE &&
              product.quantity === 0
          )
      )
      .map((business) =>
        business.products.map((product) => ({
          id: product.id,

          calculatedAt: currentDate,
          quantityChange: this.calculateQuantityChange(product, currentDate)
        }))
      )
      .flat();
  }

  private calculateTimeDifference(
    lastCalcTime: Date,
    targetTime: Date,
    timeUnitType: TimeUnitType
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
      product.timeUnitType
    );
    const quantityChange = elapsedTimeUnits * product.quantityPerTimeUnit;

    if (product.productionType === "PRODUCIBLE") {
      return quantityChange;
    } else if (product.productionType === "CONSUMABLE") {
      return -quantityChange;
    } else {
      throw new Error(`Unsupported production type: ${product.timeUnitType}`);
    }
  }
}
