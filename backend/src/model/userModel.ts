// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Iprofile, profileSchema } from './profileModel';

export interface IUser extends Document {
  email: string;
  password: string;
  name:string | null;
  profiles:Iprofile[] |[],
  
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}


const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: null },
  profiles: { type: [profileSchema], default: [] }, // Profiles is an array of profileSchema
});

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
