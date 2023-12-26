import { SCENE_COMPOSER_METHOD_METADATA } from '../grammy.constants';
import { SceneComposerMethodType } from '../types/scene-composer-method-type';
import { createMethodDecorator } from './createMethodDecorator';
import { SceneComposerMethodMetadata } from '../types/scene-composer-method-metadata';

export const createSceneComposerMethodDecorator = (
  type: SceneComposerMethodType,
  args: Record<string, any> = {},
): MethodDecorator =>
  createMethodDecorator<SceneComposerMethodMetadata>(
    SCENE_COMPOSER_METHOD_METADATA,
    type,
    args,
  );
