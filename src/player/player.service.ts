import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PlayerManagementService {
  constructor(private readonly prisma: PrismaService) {}

  createPlayer() {
    
  }
}
