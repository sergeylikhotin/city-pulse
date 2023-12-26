import { SCENE_METHODS_METADATA } from '../grammy.constants';
import { SceneMethodType } from '../types/scene-method-type';

export const createSceneMethodDecorator =
  (type: SceneMethodType, args: Record<string, any> = {}): MethodDecorator =>
  (_target, _key, descriptor) => {
    Reflect.defineMetadata(
      SCENE_METHODS_METADATA,
      [
        ...(Reflect.getMetadata(SCENE_METHODS_METADATA, descriptor.value) ??
          []),
        ...[{ type, args }],
      ],
      descriptor.value,
    );

    return descriptor;
  };
