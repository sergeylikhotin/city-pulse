import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Label = (label: string): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Label, { label });
