import { Roles, RolesRights } from '../enums/Roles';

export const allRoles = {
  [Roles.FREELANCER]: [RolesRights.GET_GIGS, RolesRights.ENROLL],
  [Roles.RECRUITER]: [RolesRights.GET_GIGS, RolesRights.AWARD],
  [Roles.ADMIN]: [RolesRights.GET_USERS, RolesRights.MANAGE_USERS],
};

// export const roles = Object.keys(allRoles);
// export const roleRights = new Map(Object.entries(allRoles));
