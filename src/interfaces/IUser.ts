import { IUser } from '@/api/models/user.model';
import { IQueryResult } from '@/interfaces/IQueryResult';

export interface IUserFrontend extends Partial<IUser> {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserFrontendQueryResult extends IQueryResult {
  results: IUserFrontend[];
}
