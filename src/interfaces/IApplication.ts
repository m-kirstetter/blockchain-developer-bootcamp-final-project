import { IBaseApplication } from '@/api/models/application.model';
import { IQueryResult } from '@/interfaces/IQueryResult';

export interface IApplicationFrontend extends IBaseApplication {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicationFrontendQueryResult extends IQueryResult {
  results: IApplicationFrontend[];
}
