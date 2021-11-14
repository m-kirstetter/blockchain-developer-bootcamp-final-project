import { GigStatus } from '@/enums/GigStatus';

export interface IGig {
  id: number;
  name: string;
  compensation: string;
  status: GigStatus;
  owner: string;
  freelancersNumber: number;
  freelancers: string[];
  worksSubmitted: number;
  works: string[];
  awardedTo: string;
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
