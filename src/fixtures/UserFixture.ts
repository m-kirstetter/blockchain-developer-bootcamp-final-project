import { IUserFrontend } from '@/interfaces/IUser';
import { Roles } from '@/api/enums/Roles';

export const UserCollectionFixture = (): IUserFrontend[] => [
  {
    address: '0xd40FadAc4bBD43f24c5Dbd76404dd653bcdFd367',
    bio: 'User bio',
    createdAt: '2021-11-08T14:15:15.370Z',
    email: 'john@doe.com',
    firstname: 'John',
    fullname: 'John Doe',
    isEmailVerified: false,
    lastname: 'Doe',
    nonce: 4743848738748374,
    role: Roles.RECRUITER,
    updatedAt: '2021-11-21T12:46:41.675Z',
    __v: 0,
    _id: '618930f3b981416eb5939f4a',
  },
  {
    address: '0xd40FadAc4bBD43f24c5Dbd76404dd653bcdFd388',
    bio: 'User 2 bio',
    createdAt: '2021-11-08T14:15:15.370Z',
    email: 'jane@doe.com',
    firstname: 'Jane',
    fullname: 'Jane Doe',
    isEmailVerified: false,
    lastname: 'Doe',
    nonce: 654567654,
    role: Roles.FREELANCER,
    updatedAt: '2021-11-21T12:46:41.675Z',
    __v: 0,
    _id: '618930f3b981416eb5939f4b',
  },
];

export const UserFixture = (): IUserFrontend => UserCollectionFixture()[0];
