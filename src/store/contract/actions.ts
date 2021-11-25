import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { addToast } from '@/components/utils';
import { IGig } from '@/api/models/gig.model';
import { IApplication } from '@/api/models/application.model';
import { utils } from 'ethers';
import { isModel } from '@/utils/typeguards';
import { IUserFrontend } from '@/interfaces/IUser';
import { IApplicationFrontend } from '@/interfaces/IApplication';
import { IUser } from '@/api/models/user.model';
import { IContractState } from './state';

export interface IContractActions {
  createContract(
    context: ActionContext<IContractState, IState>,
    payload: { application: Partial<IApplicationFrontend>; user: Partial<IUserFrontend> },
  ): Promise<any>;
  // updateContract(
  //   context: ActionContext<IContractState, IState>,
  //   payload: { application: Partial<IApplicationFrontend>; user: Partial<IUserFrontend> },
  // ): Promise<any>;
}

export const ContractActions: IContractActions = {
  async createContract(_context, { application, user }) {
    if (!isModel<IUser>(user)) throw new Error('Error, client must be Model');
    if (isModel<IGig>(application.gig)) throw new Error('Error, gig must be ObjectId');
    if (!isModel<IUser>(application.owner)) throw new Error('Error, client must be Model');
    if (!isModel<IApplication>(application)) throw new Error('Error, application must be Model');

    // const contract: Omit<IContractFrontend, '_id' | 'createdAt' | 'updatedAt'> = {
    //   client: (user._id as unknown) as Schema.Types.ObjectId,
    //   provider: (application.owner._id as unknown) as Schema.Types.ObjectId,
    //   gig: application.gig,
    //   application: application._id,
    //   currentMilestone: 0,
    // };

    const milestones: string[] = [];

    application.milestones.forEach((milestone) => {
      milestones.push(utils.parseEther(milestone.amount.toString()).toString());
    });

    try {
      // const response = await this.$axios.$post('/api/v1/contracts', contract);
      const response = '619fbbbb23a1ff68e9bc773c';
      const result = await this.$ethereum.contractRw.create(
        response,
        user.address,
        application.owner.address,
        milestones,
      );
      console.log(result);

      addToast({
        title: 'Success!',
        type: 'success',
        text: 'Contract has been created.',
      });
    } catch (error) {
      addToast({
        title: 'Error!',
        type: 'danger',
        text: error.message ?? error,
      });
    }
  },
  // async updateContract({ commit }, { application, user }) {
  //   const data = await this.$axios.$put('/contracts/' + contract._id, contract);
  //   commit('UPDATE_CONTRACT', data);
  // },
};

export default ContractActions;
