import { Schema, model, Model, models, Document } from 'mongoose';
import validator from 'validator';
import { Roles } from '../enums/Roles';
// TODO: convert to TS
// import { toJSON } from './plugins/toJSON.plugin.js';
// import { paginate } from './plugins/paginate.plugin.js';

export interface IUser extends Document {
  address: string;
  nonce: number;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  email?: string;
  role?: Roles;
  bio?: string;
  linkedin?: string;
  isEmailVerified?: boolean;
}

export interface ICreateUserRequest {
  address: string;
  nonce?: number;
}

export interface UserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isAddressTaken(address: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, UserModel>(
  {
    address: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    nonce: {
      type: Number,
      required: true,
      trim: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    role: {
      type: String,
      enum: Roles,
      default: Roles.GUEST,
    },
    bio: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// // add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
// userSchema.plugin(paginate);

// /**
//  * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
//  */
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if address is taken
 * @param {string} address - The user's address
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isAddressTaken = async function (address: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ address, _id: { $ne: excludeUserId } });
  return !!user;
};

export const User = (models.User as UserModel) || model<IUser, UserModel>('User', userSchema);
