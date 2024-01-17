import { Business } from '@prisma/client';

export class CreateBusinessDto implements Partial<Business> {
  ownerId: string;

  type: string;
  name: string;
}
