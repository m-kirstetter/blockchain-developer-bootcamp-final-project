import { Schema, model, Model, models, SchemaTypes } from 'mongoose';
import { IPaginationQueryOptions } from '@/interfaces/IPaginationQueryOptions';
import { IQueryResult } from '@/interfaces/IQueryResult';
import { IApplicationStatuses } from '@/interfaces/IStatuses';
import { paginate } from '../models/plugins/paginate.plugin';
import { IUser } from './user.model';
import { IGig } from './gig.model';

export interface IGigApplicationMilestone {
  order: number;
  title: string;
  amount: number;
}

export type GigApplicationMilestoneModel = Model<IGigApplicationMilestone>;

export interface IBaseApplication {
  why: string;
  milestones: IGigApplicationMilestone[];
  owner: Schema.Types.ObjectId | Partial<IUser>;
  gig: Schema.Types.ObjectId | Partial<IGig>;
  status: IApplicationStatuses;
  amount: number;
}

export type IApplication = Document & IBaseApplication;

export type IApplicationsQuery = Partial<IPaginationQueryOptions> &
  Partial<Omit<IApplication, '_id' | 'why' | 'milestones'>>;

export interface IApplicationsQueryResult extends IQueryResult {
  results: IApplication[];
}

export interface ApplicationModel extends Model<IApplication> {
  paginate(filter: Partial<IApplication>, options: Partial<IPaginationQueryOptions>): Promise<IApplicationsQueryResult>;
}

const applicationMilestoneSchema = new Schema<IGigApplicationMilestone, GigApplicationMilestoneModel>({
  order: Number,
  title: String,
  amount: Number,
});

const applicationSchema = new Schema<IApplication, ApplicationModel>(
  {
    why: {
      type: String,
      required: true,
    },
    milestones: {
      type: [applicationMilestoneSchema],
      required: true,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    gig: {
      type: SchemaTypes.ObjectId,
      ref: 'Gig',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Declined', 'Accepted'],
      default: 'Applied',
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.plugin(paginate);

export const Application =
  (models.Application as ApplicationModel) || model<IApplication, ApplicationModel>('Application', applicationSchema);
