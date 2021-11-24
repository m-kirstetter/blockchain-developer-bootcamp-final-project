import { IApplicationFrontend } from '@/interfaces/IApplication';
import { UserFixture } from './UserFixture';

export const ApplicationCollectionFixture = (): IApplicationFrontend[] => [
  {
    amount: 1.5,
    gig: '619781516e846ff5789a3622',
    milestones: [
      {
        order: 1,
        title: 'Milestone 1',
        amount: 0.25,
      },
      {
        order: 2,
        title: 'Milestone 2',
        amount: 0.25,
      },
      {
        order: 3,
        title: 'Milestone 3',
        amount: 1,
      },
    ],
    owner: UserFixture(),
    status: 'Applied',
    why: 'Account 2 application',
    _id: '6197827c6e846ff5789a3654',
    createdAt: '2021-11-13T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
];

export const ApplicationFixture = (): IApplicationFrontend => ApplicationCollectionFixture()[0];
