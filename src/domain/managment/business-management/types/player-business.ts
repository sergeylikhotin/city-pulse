import { Business } from "@prisma/client";
import { BusinessAsset } from "../../../../infrastructure/assets-loader/types/business.asset";
import { PlayerProduct } from "./player-product";

export type PlayerBusiness = Business & { asset: BusinessAsset } & {
  products: PlayerProduct[];
};
