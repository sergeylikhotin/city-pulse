import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { CreateContractDto } from "./dto/contract/create-contract.dto";
import { UpdateContractDto } from "./dto/contract/update-contract.dto";

@Injectable()
export class ContractEntity {
  constructor(private readonly prisma: PrismaService) {
  }

  async createContract(dto: CreateContractDto) {
    return this.prisma.$transaction(async (prisma) => {
      const { pricePerUnit, quantity, deliveriesCount } =
        await prisma.contractTerms.findUnique({
          where: { id: dto.termsId }
        });
      const totalCost = pricePerUnit.mul(quantity);

      return prisma.contract.create({
        data: {
          ...dto,

          totalCost,
          deliveriesLeft: deliveriesCount
        }
      });
    });
  }

  async updateContract(dto: UpdateContractDto) {
    return this.prisma.contract.update({
      data: {
        ...dto,

        completedAt: dto.status === "COMPLETED" ? new Date() : null
      },
      where: { id: dto.id }
    });
  }

  async getContract(contractId: string) {
    return this.prisma.contract.findUnique({
      where: { id: contractId }
    });
  }
}
