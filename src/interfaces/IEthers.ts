import { BigNumber } from 'ethers';
import { IGig } from '@/interfaces/IGig';
import { Network } from '@ethersproject/networks';
import { ErrorCode } from '@ethersproject/logger';

export interface IEthers {
  /**
   * define your data structure here
   */
  initialized: boolean;
  connected: boolean;
  error: ErrorCode | null;
  user: string | null;
  address: string | null;
  network: Network | null;
  ens: string | null;
  loading: boolean;
}

export interface IEthereumProvider {
  isMetaMask?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  request: Function;
  [propName: string]: any;
}

export interface IEthersErrorResponse {
  code: number;
  message: string;
}

export interface IEthersEvent {
  gigId: number;
  status: number;
}

export interface IEthereumRequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface IGigsServiceResponse {
  gigsCount: number;
  gigs: IGig[];
}

export interface IGigEthersResponse {
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

export interface IWorkEthersResponse {
  0: BigNumber;
  1: string;
  2: string;
  3: true;
  contractAddress: string;
  gigId: BigNumber;
  owner: string;
  valid: boolean;
}
