import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  createPlayer(dto: CreatePlayerDto) {
    return this.prisma.player.create({
      data: dto,
    });
  }

  updatePlayer(id: string, dto: UpdatePlayerDto) {
    return this.prisma.player.update({
      data: dto,
      where: { id },
    });
  }

  getPlayer(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  getPlayerByUserId(userId: number) {
    return this.prisma.player.findUnique({
      where: { userId },
    });
  }
}
