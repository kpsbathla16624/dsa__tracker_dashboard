// controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../model/userModel";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";


const SECRET_KEY = "7sQ8B#fH&3y^A!jKpLq9R8$g5vT@eF&nJzYx1wC2^uZ@oS#eA";

export const registerUser = async (req: any, res: any) => {
  const { email, password , name} = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already exists" });
    }

    // Create a new user instance
    const user = new User({ email, password , name });

    // Save the user to the database
    await user.save();

    // Respond to the client
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export async function loginUser(req: any, res: any) {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Convert the Mongoose document to a plain JavaScript object
    const userObj = user.toObject();

    // Remove the password field before sending the response
    delete userObj.password;

    // Return the user object along with the token
    return res.json({ token, user: userObj });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function GetUserById(req: any, res: any) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const objectId = new ObjectId(id as string);
    const collection = await mongoose.connection.db?.collection("users");

    const result = await collection?.findOne({
      _id: objectId,
    });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function UpdateUser(req: any, res: any) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const objectId = new ObjectId(id as string);
  const collection = mongoose.connection.db?.collection("users");

  try {
  
    const user = await collection?.findOne({ _id: objectId });
    
  
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const newUser = req.body;
   
    newUser.password = user.password; 
    
    

    console.log("Attempting to replace user with data:", newUser);


    const result = await collection?.findOneAndUpdate(
      { _id: objectId }, 
      {$set: newUser},
      {returnDocument:"after"} 
    );

    // Check if the replace was successful
    if (result && result.modifiedCount === 0) {
      console.error("Replace failed. Result:", result);
      return res.status(500).json({ message: "Failed to update user" });
    }

    // Return the updated user data (optional: you can fetch the user again if needed)
    return res.status(200).json(result);
    
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}