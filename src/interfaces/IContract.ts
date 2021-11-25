import { IBaseContract } from '@/api/models/contract.model';
import { IQueryResult } from '@/interfaces/IQueryResult';

export interface IContractFrontend extends IBaseContract {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContractFrontendQueryResult extends IQueryResult {
  results: IContractFrontend[];
}
