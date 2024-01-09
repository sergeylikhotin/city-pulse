import { createSceneMethodDecorator } from "../../utils/create-scene-method-decorator";
import { SceneMethodType } from "../../types/scene-method-type";

export const Always = (): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Always);
