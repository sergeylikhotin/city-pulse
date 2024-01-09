import { SCENE_COMPOSER_METHOD_METADATA } from '../grammy.constants';
import { SceneComposerMethodType } from '../types/scene-composer-method-type';

export const createSceneComposerMethodDecorator =
  (
    type: SceneComposerMethodType,
    args: Record<string, any> = {},
  ): MethodDecorator =>
  (_target, _key, descriptor) => {
    Reflect.defineMetadata(
      SCENE_COMPOSER_METHOD_METADATA,
      { type, args },
      descriptor.value,
    );

    return descriptor;
  };
