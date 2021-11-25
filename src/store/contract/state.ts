import { IContractFrontend } from '@/interfaces/IContract';

export interface IContractState {
  /**
   * put your state attributes here, for example:
   * myAttribute: any;
   */
  contracts: IContractFrontend[];
  currentContract: IContractFrontend;
}

export const ContractDefaultState = (): IContractState => {
  return {
    /**
     * put your default value here, for example:
     * myAttribute: null,
     */
    contracts: [],
    currentContract: null,
  };
};

export default ContractDefaultState;
