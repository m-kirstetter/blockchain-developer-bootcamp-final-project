import EthersDefaultState from "./state";
import EthersActions from "./actions";
import EthersMutations from "./mutations";
import EthersGetters from "./getters";

export type EthersRootState = ReturnType<typeof EthersDefaultState>;

export default {
  EthersDefaultState,
  EthersActions,
  EthersMutations,
  EthersGetters
};
