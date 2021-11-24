import { Schema } from 'mongoose';
import { IBaseGig, IGigBudget } from '@/api/models/gig.model';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { IUserFrontend } from './IUser';
import { IApplicationFrontend } from './IApplication';

interface IGigFrontendBudget extends IGigBudget {
  _id?: string;
}

export interface IGigFrontend extends IBaseGig {
  _id: string;
  budget: IGigFrontendBudget;
  createdAt: string;
  updatedAt: string;
  owner: Schema.Types.ObjectId | Partial<IUserFrontend>;
  applications: Schema.Types.ObjectId[] | Partial<IApplicationFrontend>[];
}

export interface IGigFrontendQueryResult extends IQueryResult {
  results: IGigFrontend[];
}
