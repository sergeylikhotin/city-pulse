import { createSceneComposerMethodDecorator } from "../../utils/create-scene-composer-method-decorator";
import { SceneComposerMethodType } from "../../types/scene-composer-method-type";
import { MaybeArray } from "grammy/out/context";

export const Hears = (trigger: MaybeArray<string | RegExp>): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.Hears, {
    trigger
  });
