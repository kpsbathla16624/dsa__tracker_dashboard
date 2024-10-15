import mongoose, { Schema, Document } from "mongoose";

// Define the Iprofile interface
export interface Iprofile extends Document {
  platformname: string;
  profileurl: string;
}

// Create the profileSchema
const profileSchema: Schema = new Schema({
  platformname: { type: String, required: true },
  profileurl: { type: String, required: true }
});

// Export the profile schema and interface
export { profileSchema };
