import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Label = (label: string): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Label, { label });
