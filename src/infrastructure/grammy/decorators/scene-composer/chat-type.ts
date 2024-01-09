import { createSceneComposerMethodDecorator } from "../../utils/create-scene-composer-method-decorator";
import { SceneComposerMethodType } from "../../types/scene-composer-method-type";
import { Chat } from "grammy/types";
import { MaybeArray } from "grammy/out/context";

export const ChatType = <T extends Chat["type"]>(
  chatType: MaybeArray<T>
): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.ChatType, {
    chatType
  });
