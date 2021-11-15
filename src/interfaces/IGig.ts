import { IBaseGig } from '@/api/models/gig.model';
import { IQueryResult } from '@/interfaces/IQueryResult';

export interface IGigFrontend extends IBaseGig {
  _id: string;
  budget: {
    _id: string;
    min: number;
    max: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IGigFrontendQueryResult extends IQueryResult {
  results: IGigFrontend[];
}

export interface IGigFormInput {
  title: string;
  description: string;
  freelancers: number;
  compensation: number;
}

export interface IGigWorkFormat {
  gigId: string;
  contract: string;
}
