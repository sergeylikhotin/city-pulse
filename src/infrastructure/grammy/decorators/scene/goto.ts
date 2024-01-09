import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Goto = (name: string, arg?: any): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Goto, { name, arg });
