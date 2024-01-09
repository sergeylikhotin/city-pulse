import { Decimal } from "decimal.js";
import { TimeUnitType } from "@prisma/client";

export type BusinessAsset = {
  type: string;

  name: string;
  description: string;

  products: {
    consumable: BusinessProductAsset[];
    producible: BusinessProductAsset[];
  };

  productivity: BusinessAssetProductivity;

  financials?: BusinessAssetFinancials;
  system?: boolean;
};

export type BusinessAssetFinancials = {
  initialInvestment: Decimal;
  operatingCosts: Decimal;
};

export type BusinessAssetProductivity =
  | {
  type: BusinessAssetProductivityType.CONSTANT;
  data: number;
}
  | {
  type: BusinessAssetProductivityType.GRAPH;
  data: { time: string; productivity: number }[];
};

export enum BusinessAssetProductivityType {
  CONSTANT = "CONSTANT",
  GRAPH = "GRAPH",
}

export type BusinessProductAsset = {
  type: string;

  quantityPerTimeUnit: number;
  timeUnitType: TimeUnitType;

  initialQuantity?: number;

  unitPrice?: Decimal;
};
