import { createSceneComposerMethodDecorator } from "../../utils/create-scene-composer-method-decorator";
import { SceneComposerMethodType } from "../../types/scene-composer-method-type";

export const Use = (): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.Use);
