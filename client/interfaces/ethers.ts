import { BigNumber } from "ethers";
import { Gig } from "./gig";

export interface EthereumProvider {
  isMetaMask?: boolean;
  request: Function;
  [propName: string]: any;
}

export interface EthersErrorResponse {
  code: number;
  message: string;
}

export interface EthersEvent {
  gigId: number;
  status: number;
}

export interface EthereumRequestArguments {
  method: string;
  params?: unknown[] | object;
}

export interface GigsServiceResponse {
  gigsCount: number;
  gigs: Gig[];
}

export interface GigEthersResponse {
  0: string;
  1: BigNumber;
  2: number;
  3: string;
  4: number;
  5: number;
  6: number;
  7: string;
  awardedTo: string;
  compensation: BigNumber;
  enrolled: number;
  freelancersNumber: number;
  name: string;
  owner: string;
  status: number;
  works: number;
}

export interface WorkEthersResponse {
  0: BigNumber;
  1: string;
  2: string;
  3: true;
  contractAddress: string;
  gigId: BigNumber;
  owner: string;
  valid: boolean;
}
