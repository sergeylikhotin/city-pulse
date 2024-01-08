import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContractTermsDto } from './dto/create-contract-terms.dto';
import { UpdateContractTermsDto } from './dto/update-contract-terms.dto';

@Injectable()
export class ContractTermsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTerms(dto: CreateContractTermsDto) {
    return this.prisma.contractTerms.create({
      data: dto,
    });
  }

  async updateTerms(dto: UpdateContractTermsDto) {
    return this.prisma.contractTerms.update({
      data: dto,
      where: { id: dto.id },
    });
  }

  async getTerms(termsId: string) {
    return this.prisma.contractTerms.findUnique({
      where: { id: termsId },
    });
  }
}
