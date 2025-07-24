import { Document } from 'mongoose';

export interface IAdmin {
  email: string;
  password: string;
  comparePassword?: (inputPassword: string) => Promise<boolean>;
}

export type AdminDocument = Document & IAdmin;

