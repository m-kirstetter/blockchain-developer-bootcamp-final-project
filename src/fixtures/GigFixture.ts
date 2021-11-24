import { IStatuses } from '@/interfaces/IStatuses';
import { IGigFrontend } from '@/interfaces/IGig';
import { ApplicationCollectionFixture } from './ApplicationFixture';
import { UserFixture } from './UserFixture';

export const GigCollectionFixture = (): IGigFrontend[] => [
  {
    _id: '618f74e652e1bd099b345a01',
    applications: ApplicationCollectionFixture(),
    title: 'title',
    description: 'description',
    details: 'details',
    skills: 'skills',
    owner: UserFixture(),
    status: 'Registered' as IStatuses,
    budget: {
      _id: '618f74e652e1bd099b345a04',
      min: 1,
      max: 4,
    },
    createdAt: '2021-11-13T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
  {
    _id: '618f74e652e1bd099b345a02',
    applications: ApplicationCollectionFixture(),
    title: 'title',
    description: 'description',
    details: 'details',
    skills: 'skills',
    owner: UserFixture(),
    status: 'Registered' as IStatuses,
    budget: {
      _id: '618f74e652e1bd099b345a04',
      min: 1,
      max: 4,
    },
    createdAt: '2021-11-13T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
  {
    _id: '618f74e652e1bd099b345a03',
    applications: ApplicationCollectionFixture(),
    title: 'title',
    description: 'description',
    details: 'details',
    skills: 'skills',
    owner: UserFixture(),
    status: 'Registered' as IStatuses,
    budget: {
      _id: '618f74e652e1bd099b345a04',
      min: 1,
      max: 4,
    },
    createdAt: '2021-11-13T08:18:46.652Z',
    updatedAt: '2021-11-13T08:18:46.652Z',
  },
];

export const GigFixture = (): IGigFrontend => GigCollectionFixture()[0];
