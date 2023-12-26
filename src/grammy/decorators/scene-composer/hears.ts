import { createSceneComposerMethodDecorator } from '../../utils/createSceneComposerMethodDecorator';
import { SceneComposerMethodType } from '../../types/scene-composer-method-type';
import { FilterQuery } from 'grammy';

export const Use = (): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.Use);
