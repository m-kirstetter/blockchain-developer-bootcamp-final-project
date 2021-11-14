import { Network } from '@ethersproject/networks';
import { ErrorCode } from '@ethersproject/logger';

export interface IEther {
  /**
   * define your data structure here
   */
  id?: string;
  initialized: boolean;
  connected: boolean;
  error: ErrorCode | null;
  user: string | null;
  address: string | null;
  network: Network | null;
  ens: string | null;
  loading: boolean;
}
