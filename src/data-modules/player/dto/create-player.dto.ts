import { Player } from '@prisma/client';

export class CreatePlayerDto implements Partial<Player> {
  userId: number;
  username: string;
}
