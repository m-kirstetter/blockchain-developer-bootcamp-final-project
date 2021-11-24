import { IApplication } from '@/api/models/application.model';
import { Schema } from 'mongoose';
import { IUser } from '@/api/models/user.model';

export function isApplicationArray(
  array: Schema.Types.ObjectId[] | Partial<IApplication>[],
): array is Partial<IApplication>[] {
  return typeof array[0] !== 'string';
}

export function isUser(user: Schema.Types.ObjectId | Partial<IUser>): user is Partial<IUser> {
  return typeof user !== 'string';
}
