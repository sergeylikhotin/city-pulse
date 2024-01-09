import { MarketOffer, MarketOfferStatus, MarketOfferType } from "@prisma/client";
import Decimal from "decimal.js";

export class CreateMarketOfferDto implements Partial<MarketOffer> {
  productId: string;
  quantity: number;
  pricePerUnit: Decimal;
  sellerId: string;
  offerType: MarketOfferType;
  status: MarketOfferStatus;
}
