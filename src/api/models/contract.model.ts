import { Schema, model, Model, models, SchemaTypes } from 'mongoose';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { paginate } from '../models/plugins/paginate.plugin';
import { IUser } from './user.model';
import { IGig } from './gig.model';
import { IApplication } from './application.model';

export interface IBaseContract {
  client: Schema.Types.ObjectId | Partial<IUser>;
  provider: Schema.Types.ObjectId | Partial<IUser>;
  contract?: string;
  gig: Schema.Types.ObjectId | Partial<IGig>;
  application: Schema.Types.ObjectId | Partial<IApplication>;
  paid?: boolean;
}

export type IContract = Document & IBaseContract;

export type IContractsQuery = Partial<IPaginationQueryOptions> & Partial<Omit<IContract, '_id' | 'currentMilestone'>>;

export interface IContractsQueryResult extends IQueryResult {
  results: IContract[];
}

export interface ContractModel extends Model<IContract> {
  paginate(filter: Partial<IContract>, options: Partial<IPaginationQueryOptions>): Promise<IContractsQueryResult>;
}

const contractSchema = new Schema<IContract, ContractModel>(
  {
    client: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    contract: {
      type: String,
    },
    gig: {
      type: SchemaTypes.ObjectId,
      ref: 'Gig',
      required: true,
    },
    application: {
      type: SchemaTypes.ObjectId,
      ref: 'Application',
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

contractSchema.plugin(paginate);

export const Contract =
  (models.Contract as ContractModel) || model<IContract, ContractModel>('Contract', contractSchema);
