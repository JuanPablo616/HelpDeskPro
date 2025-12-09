import { Schema, model, models } from "mongoose";
import { IUser } from "./types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "agent"], required: true },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
