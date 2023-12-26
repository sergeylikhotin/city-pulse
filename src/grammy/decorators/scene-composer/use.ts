import { createSceneComposerMethodDecorator } from '../../utils/createSceneComposerMethodDecorator';
import { SceneComposerMethodType } from '../../types/scene-composer-method-type';
import { FilterQuery } from 'grammy';

export const On = <F extends FilterQuery>(filter: F | F[]): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.On, { filter });
