import { Player } from '@prisma/client';

export class UpdatePlayerDto implements Partial<Player> {
  readonly username: string;
}
