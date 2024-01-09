import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Call = (name: string, arg?: any): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Call, { name, arg });
