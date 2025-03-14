import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  role: "user" | "admin"
  name?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
    },
  },
  { timestamps: true },
)

// Prevent model overwrite error during hot reloading in development
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

