import { Player } from '@prisma/client';

export class CreatePlayerDto implements Partial<Player> {
  readonly userId: number;
  readonly username: string;
}
