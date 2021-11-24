import { Schema, model, Model, models, SchemaTypes } from 'mongoose';
import { TokenTypes } from '../enums/TokenTypes';
// import { toJSON } from './plugins/toJSON.plugin.js';

export interface IToken {
  token: string;
  user: Schema.Types.ObjectId;
  type: TokenTypes;
  expires: Date;
  blacklisted?: boolean;
}

export type TokenModel = Model<IToken>;

// export interface ITokenResponse {
//   token: string;
//   expires: Date;
// }

// export interface ITokensResponse {
//   access: ITokenResponse;
//   refresh: ITokenResponse;
// }

export interface ITokensResponse {
  accessToken: string;
  refreshToken: string;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [TokenTypes.ACCESS, TokenTypes.REFRESH, TokenTypes.RESET_PASSWORD, TokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
// tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
export const Token = (models.Token as TokenModel) || model<IToken, TokenModel>('Token', tokenSchema);
