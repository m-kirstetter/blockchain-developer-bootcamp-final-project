import { ActionContext } from 'vuex';
import { IState } from '@/interfaces/IState';
import { IGig } from '@/api/models/gig.model';
import { IApplication } from '@/api/models/application.model';
import { utils } from 'ethers';
import { isApplicationArray, isModel } from '@/utils/typeguards';
import { IUserFrontend } from '@/interfaces/IUser';
import { IGigFrontend } from '@/interfaces/IGig';
import { IApplicationFrontend } from '@/interfaces/IApplication';
import { IUser } from '@/api/models/user.model';
import { IContractFrontend } from '@/interfaces/IContract';
import { AtLeast } from '@/utils/generics';
import { Schema } from 'mongoose';
// import SmarterContractFactory from '@/../build/contracts/SmarterContractFactory.json';
import { IContractState } from './state';

export interface IContractActions {
  createContract(
    context: ActionContext<IContractState, IState>,
    payload: { application: Partial<IApplicationFrontend>; user: Partial<IUserFrontend>; gig: Partial<IGigFrontend> },
  ): Promise<any>;
  updateContract(
    context: ActionContext<IContractState, IState>,
    contract: AtLeast<IContractFrontend, '_id'> & Partial<Pick<IContractFrontend, 'contract'>>,
  ): Promise<any>;
}

export const ContractActions: IContractActions = {
  async createContract(_context, { application, user, gig }) {
    if (!isModel<IUser>(user)) throw new Error('Error, client must be Model');
    if (isModel<IGig>(application.gig)) throw new Error('Error, gig must be ObjectId');
    if (!isModel<IUser>(application.owner)) throw new Error('Error, client must be Model');
    if (!isModel<IApplication>(application)) throw new Error('Error, application must be Model');

    const contract: Omit<IContractFrontend, '_id' | 'createdAt' | 'updatedAt'> = {
      client: (user._id as unknown) as Schema.Types.ObjectId,
      provider: (application.owner._id as unknown) as Schema.Types.ObjectId,
      gig: application.gig,
      application: application._id,
    };

    const milestones: string[] = [];

    application.milestones.forEach((milestone) => {
      milestones.push(utils.parseEther(milestone.amount.toString()).toString());
    });

    const response = await this.$axios.$post('/api/v1/contracts', contract);

    const gasEstimate = await this.$ethereum.contractRw.estimateGas.create(
      response.contract._id,
      user.address,
      application.owner.address,
      milestones,
      {
        gasLimit: process.env.NUXT_ENV_GAS_LIMIT,
      },
    );

    await this.$ethereum.contractRw.create(response.contract._id, user.address, application.owner.address, milestones, {
      gasLimit: process.env.NUXT_ENV_GAS_LIMIT,
      gasPrice: gasEstimate.toString(),
    });

    await this.$axios.$patch('/api/v1/applications/' + application._id, { status: 'Accepted' });

    if (!isApplicationArray(gig.applications)) throw new Error('Error, applications must be Model array');
    gig.applications.forEach(async (declinedApplication: IApplicationFrontend) => {
      if (declinedApplication._id !== application._id) {
        await this.$axios.$patch('/api/v1/applications/' + declinedApplication._id, { status: 'Declined' });
      }
    });

    await this.$axios.$patch('/api/v1/gigs/' + gig._id, { status: 'Running' });
  },
  async updateContract(_context, toUpdate) {
    const contractId = toUpdate._id;
    delete toUpdate._id;

    await this.$axios.$patch('/api/v1/contracts/' + contractId, toUpdate);
  },
};

export default ContractActions;
