import { Document } from 'mongoose';
export interface IUser extends Document {
  readonly name: string;
  readonly roleNumber: number;
  readonly gender: string;
}
