import { Injectable } from '@nestjs/common';
import { CreateContractTermsDto } from '../../data-modules/contract-terms/dto/create-contract-terms.dto';
import { ContractTermsService } from '../../data-modules/contract-terms/contract-terms.service';
import { UpdateContractTermsDto } from '../../data-modules/contract-terms/dto/update-contract-terms.dto';

@Injectable()
export class ContractTermsManagementService {
  constructor(private readonly contractTermsService: ContractTermsService) {}

  async createTerms(dto: CreateContractTermsDto) {
    return this.contractTermsService.createTerms(dto);
  }

  async updateTerms(dto: UpdateContractTermsDto) {
    return this.contractTermsService.updateTerms(dto);
  }

  async getTerms(termsId: string) {
    return this.contractTermsService.getTerms(termsId);
  }
}
