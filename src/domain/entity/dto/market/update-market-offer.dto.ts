import { MarketOffer, MarketOfferStatus, MarketOfferType } from "@prisma/client";
import Decimal from "decimal.js";

export class UpdateMarketOfferDto implements Partial<MarketOffer> {
  id: string;

  quantity: number;
  pricePerUnit: Decimal;
  offerType: MarketOfferType;
  status: MarketOfferStatus;
}
