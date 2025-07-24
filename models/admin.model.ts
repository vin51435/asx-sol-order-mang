import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { AdminDocument } from '@/types/admin';

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to validate password
adminSchema.methods.comparePassword = function (inputPassword: string) {
  return bcrypt.compare(inputPassword, this.password);
};

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', adminSchema);

