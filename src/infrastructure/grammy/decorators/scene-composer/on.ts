import { createSceneComposerMethodDecorator } from "../../utils/create-scene-composer-method-decorator";
import { SceneComposerMethodType } from "../../types/scene-composer-method-type";
import { FilterQuery } from "grammy";

export const On = <F extends FilterQuery>(filter: F | F[]): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.On, { filter });
