import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Wait = (label: string): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Wait, { label });
