import { SCENE_METHOD_METADATA } from '../grammy.constants';
import { SceneMethodType } from '../types/scene-method-type';
import { createMethodDecorator } from './createMethodDecorator';
import { SceneMethodMetadata } from '../types/scene-method-metadata';

export const createSceneMethodDecorator = (
  type: SceneMethodType,
  args: Record<string, any> = {},
): MethodDecorator =>
  createMethodDecorator<SceneMethodMetadata>(SCENE_METHOD_METADATA, type, args);
