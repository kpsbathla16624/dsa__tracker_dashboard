// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
  email: string;
  password: string;
  name:string | null;
  leetcode: String|null;
  codeforces:string|null;
  codechef:string|null;

  comparePassword: (candidatePassword: string) => Promise<boolean>;
}


const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: null },
  leetcode: { type: String, default: null },
  codeforces: { type: String, default: null },
  codechef: { type: String, default: null },

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
