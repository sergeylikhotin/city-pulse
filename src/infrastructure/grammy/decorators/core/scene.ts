import { SetMetadata } from "@nestjs/common";
import { SCENE_METADATA } from "../../grammy.constants";
import { SceneMetadata } from "../../types/scene-metadata";

export const Scene = (name?: string): ClassDecorator =>
  SetMetadata<string, SceneMetadata>(SCENE_METADATA, { name });
