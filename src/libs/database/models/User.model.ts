import mongoose, { Schema, model } from "mongoose";

/* Types */
import { IUser } from "@/types";

/* Utils */
import { capitalizeFirstLetter, crypto } from "@/utils";

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
    tokenCalendar: { type: String, default: null },
    tokenRefreshCalendar: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.firstName && typeof this.firstName === "string") {
    this.firstName = capitalizeFirstLetter(this.firstName);
    this.firstName = (await crypto.encrypt(this.firstName)) as string;
  }
  if (this.lastName && typeof this.lastName === "string") {
    this.lastName = capitalizeFirstLetter(this.lastName);
    this.lastName = (await crypto.encrypt(this.lastName)) as string;
  }
  if (this.phone && typeof this.phone === "string") {
    this.phone = (await crypto.encrypt(this.phone)) as string;
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update.firstName && typeof update.firstName === "string") {
    update.firstName = (await crypto.encrypt(update.firstName)) as string;
  }
  if (update.lastName && typeof update.lastName === "string") {
    update.lastName = (await crypto.encrypt(update.lastName)) as string;
  }
  if (update.phone && typeof update.phone === "string") {
    update.phone = (await crypto.encrypt(update.phone)) as string;
  }
  next();
});

UserSchema.post("findOneAndUpdate", async function (doc: IUser) {
  if (doc) {
    if (doc.firstName && typeof doc.firstName === "string") {
      doc.firstName = (await crypto.decrypt(doc.firstName)) as string;
    }
    if (doc.lastName && typeof doc.lastName === "string") {
      doc.lastName = (await crypto.decrypt(doc.lastName)) as string;
    }
    if (doc.phone && typeof doc.phone === "string") {
      doc.phone = (await crypto.decrypt(doc.phone)) as string;
    }
    if (doc?.password) {
      delete doc.password;
    }
  }
});

UserSchema.post("findOne", async function (doc: IUser) {
  if (doc) {
    if (doc.firstName && typeof doc.firstName === "string") {
      doc.firstName = (await crypto.decrypt(doc.firstName)) as string;
    }
    if (doc.lastName && typeof doc.lastName === "string") {
      doc.lastName = (await crypto.decrypt(doc.lastName)) as string;
    }
    if (doc.phone && typeof doc.phone === "string") {
      doc.phone = (await crypto.decrypt(doc.phone)) as string;
    }
  }
});

export const User = mongoose.models?.User || model<IUser>("User", UserSchema);
