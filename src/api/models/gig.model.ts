import { Schema, model, Model, models, SchemaTypes } from 'mongoose';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { IStatuses } from '@/interfaces/IStatuses';
import { paginate } from '../models/plugins/paginate.plugin';

export interface IGigBudget {
  min: number;
  max: number;
}

export type GigBudgetModel = Model<IGigBudget>;

export interface IBaseGig {
  title: string;
  description: string;
  details: string;
  skills: string;
  owner: Schema.Types.ObjectId;
  status: IStatuses;
  budget: IGigBudget;
  freelancer?: Schema.Types.ObjectId;
  deadline?: Date;
}

export type IGig = Document & IBaseGig;

export interface IGigsQueryResult extends IQueryResult {
  results: IGig[];
}

export interface GigModel extends Model<IGig> {
  paginate(filter: Partial<IGig>, options: Partial<IPaginationQueryOptions>): Promise<IGigsQueryResult>;
}

const gigBudgetSchema = new Schema<IGigBudget, GigBudgetModel>({
  min: Number,
  max: Number,
});

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
    owner: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ['Registered', 'Open', 'Review', 'Awarded'],
      default: 'Registered',
    },
    budget: {
      type: gigBudgetSchema,
      required: true,
    },
    freelancer: {
      type: SchemaTypes.ObjectId,
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

export const Gig = (models.Gig as GigModel) || model<IGig, GigModel>('Gig', gigSchema);
