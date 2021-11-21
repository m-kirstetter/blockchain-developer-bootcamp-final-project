import { Schema } from 'mongoose';
import { IBaseApplication } from '@/api/models/application.model';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { IUserFrontend } from './IUser';

export interface IApplicationFrontend extends IBaseApplication {
  _id: string;
  createdAt: string;
  updatedAt: string;
  owner: Schema.Types.ObjectId | Partial<IUserFrontend>;
}

export interface IApplicationFrontendQueryResult extends IQueryResult {
  results: IApplicationFrontend[];
}
