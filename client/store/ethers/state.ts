import { Network } from "@ethersproject/networks";
import { ErrorCode } from "@ethersproject/logger";

interface EthersState {
  initialized: boolean;
  connected: boolean;
  error: ErrorCode | null;
  user: string | null;
  address: string | null;
  network: Network | null;
  ens: string | null;
  loading: boolean;
}

const EthersDefaultState = (): EthersState => ({
  initialized: false,
  connected: false,
  error: null,
  user: null, // user is ens or address
  address: null,
  network: null,
  ens: null,
  loading: false
});

export default EthersDefaultState;
