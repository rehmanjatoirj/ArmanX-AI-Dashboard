import { HydratedDocument, Model, Schema, model } from 'mongoose';

export interface User {
  email: string;
  hashedPassword: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type UserDocument = HydratedDocument<User>;
type UserModel = Model<User>;

const userSchema = new Schema<User, UserModel>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    hashedPassword: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.toJSON = function toJSON(this: UserDocument) {
  const obj = this.toObject() as User & { hashedPassword: string };
  const { hashedPassword: _hashedPassword, ...sanitized } = obj;
  return sanitized;
};

export const UserModel = model<User, UserModel>('User', userSchema);
