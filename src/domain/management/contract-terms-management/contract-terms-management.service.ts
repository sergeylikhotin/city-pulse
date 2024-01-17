import { Injectable } from '@nestjs/common';

import { CreateContractTermsDto } from '../../entity/dto/contract-terms/create-contract-terms.dto';
import { ContractTermsEntity } from '../../entity/contract-terms.entity';
import { UpdateContractTermsDto } from '../../entity/dto/contract-terms/update-contract-terms.dto';

@Injectable()
export class ContractTermsManagementService {
  constructor(private readonly contractTermsEntity: ContractTermsEntity) {}

  async createTerms(dto: CreateContractTermsDto) {
    return this.contractTermsEntity.createTerms(dto);
  }

  async updateTerms(dto: UpdateContractTermsDto) {
    return this.contractTermsEntity.updateTerms(dto);
  }

  async getTerms(termsId: string) {
    return this.contractTermsEntity.getTerms(termsId);
  }
}
