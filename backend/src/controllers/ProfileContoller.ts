import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../model/userModel";
import { Iprofile } from "../model/profileModel";

export async function AddprofileTOUser(req: any, res: any) {
  try {
    const { id } = req.query;


    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const _id = new ObjectId(id as string);

  
    const profiles = req.body.profiles as Iprofile[];

    if (!profiles || !Array.isArray(profiles)) {
      return res.status(400).json({ message: "Profiles must be an array" });
    }

    const result = await User.findOneAndUpdate(
      { _id }, // Filter by user ID
      { $push: { profiles: profiles } }, 
      { new: true } 
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error adding profiles to user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
