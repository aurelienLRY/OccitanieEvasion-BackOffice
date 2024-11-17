import mongoose, { Schema, model } from "mongoose";

/* Types */
import { IUser } from "@/types";

/* Utils */
import { capitalizeFirstLetter } from "@/utils";

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, default: "first-name ?" },
    lastName: { type: String, required: true, default: "last-name ?" },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"],
    },
    phone: { type: String },
    avatar: { type: String, default: "/img/default-avatar.webp" },
    password: { type: String, required: true },
    username: { type: String, required: true, default: "username ?" },
    calendar: { type: Boolean, default: false },
    tokenCalendar: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (this.firstName) {
    this.firstName = capitalizeFirstLetter(this.firstName);
  }
  if (this.lastName) {
    this.lastName = capitalizeFirstLetter(this.lastName);
  }
  next();
});

const User = mongoose.models?.User || model<IUser>("User", UserSchema);
export default User;
