import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    totalScore: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const userModel = model("User", userSchema);
export default userModel;
