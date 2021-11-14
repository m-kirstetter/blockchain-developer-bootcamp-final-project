import { IBaseGig } from '@/api/models/gig.model';

export interface IGigFrontend extends IBaseGig {
  _id: number;
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
