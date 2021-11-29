import { Schema, model, Model, models, SchemaTypes } from 'mongoose';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { IGigStatuses } from '@/interfaces/IStatuses';
import { paginate } from '../models/plugins/paginate.plugin';
import { IUser } from './user.model';
import { IApplication } from './application.model';
import { IContract } from './contract.model';

export interface IGigBudget {
  min: number;
  max: number;
}

// export type GigBudgetModel = Model<IGigBudget>;

export interface IBaseGig {
  title: string;
  description: string;
  details: string;
  skills: string;
  owner: Schema.Types.ObjectId | Partial<IUser>;
  status: IGigStatuses;
  budget: IGigBudget;
  applications?: Schema.Types.ObjectId[] | Partial<IApplication>[];
  contract?: Schema.Types.ObjectId | Partial<IContract>;
  deadline?: Date;
}

export type IGig = Document & IBaseGig;

export type IGigsQuery = Partial<IPaginationQueryOptions> &
  Partial<Omit<IGig, '_id' | 'title' | 'description' | 'skills' | 'details'>>;

export interface IGigsQueryResult extends IQueryResult {
  results: IGig[];
}

export interface GigModel extends Model<IGig> {
  paginate(filter: Partial<IGig>, options: Partial<IPaginationQueryOptions>): Promise<IGigsQueryResult>;
}

const gigBudgetSchema = {
  min: Number,
  max: Number,
};

const gigSchema = new Schema<IGig, GigModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Running', 'Closed'],
      default: 'Open',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    budget: {
      type: gigBudgetSchema,
      required: true,
    },
    applications: {
      type: [{ type: SchemaTypes.ObjectId, ref: 'Application' }],
    },
    contract: {
      type: SchemaTypes.ObjectId,
      ref: 'Contract',
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

gigSchema.plugin(paginate);

gigSchema.pre('find', function () {
  this.populate([
    {
      path: 'owner',
      select: 'address bio linkedin role',
    },
    {
      path: 'contract',
      select: 'client provider contract application currentMilestone paid',
      populate: [
        {
          path: 'client',
          select: 'address',
        },
        {
          path: 'provider',
          select: 'address',
        },
      ],
    },
    {
      path: 'applications',
      select: 'why milestones owner status amount gig',
      populate: [
        {
          path: 'owner',
          select: 'address bio linkedin role',
        },
      ],
    },
  ]);
});

export const Gig = (models.Gig as GigModel) || model<IGig, GigModel>('Gig', gigSchema);
