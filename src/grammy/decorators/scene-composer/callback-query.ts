import { createSceneComposerMethodDecorator } from '../../utils/createSceneComposerMethodDecorator';
import { SceneComposerMethodType } from '../../types/scene-composer-method-type';

export const Use = (): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.Use);
