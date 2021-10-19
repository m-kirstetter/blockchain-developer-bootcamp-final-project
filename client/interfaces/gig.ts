import { GigStatus } from "~/enums/gig-status";

export interface Gig {
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

export interface GigFormInput {
  title: string;
  description: string;
  freelancers: number;
  compensation: number;
}

export interface GigWorkFormat {
  gigId: string;
  contract: string;
}
