import { SceneMethodType } from "./scene-method-type";

export type SceneMethodsMetadata = {
  readonly type: SceneMethodType;
  readonly args: Record<string, any>;
}[];
