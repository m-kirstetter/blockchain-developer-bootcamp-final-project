import { IApplication } from '@/api/models/application.model';
import { Schema } from 'mongoose';

export function isApplicationArray(
  array: Schema.Types.ObjectId[] | Partial<IApplication>[],
): array is Partial<IApplication>[] {
  return typeof array[0] !== 'string';
}

export function isModel<T>(model: Schema.Types.ObjectId | Partial<T>): model is Partial<T> {
  return typeof model !== 'string';
}
