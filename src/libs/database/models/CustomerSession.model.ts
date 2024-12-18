import mongoose from "mongoose";

/* utils */
import { crypto, capitalizeFirstLetter } from "@/utils";

/* types */
import { ICustomerSession } from "@/types";

const CustomerSessionSchema = new mongoose.Schema<ICustomerSession>({
  sessionId: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  validatedAt: { type: Date, required: false },
  canceledAt: { type: Date, required: false },
  status: { type: String, required: true },
  typeOfReservation: { type: String, required: false },
  number_of_people: { type: Number, required: true },
  last_name: { type: String, required: true },
  first_names: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Email invalide"],
  },
  phone: { type: String, required: true },
  people_list: [
    {
      size: { type: String, required: true },
      weight: { type: String, required: true },
      price_applicable: { type: Number, required: true },
      isReduced: { type: Boolean, required: true },
    },
  ],
  price_applicable: { type: Number, required: true },
  price_total: { type: Number, required: true },
  tarification: { type: String, required: true },
});

CustomerSessionSchema.pre("save", async function (next) {
  if (this.isModified("last_name") || this.isModified("first_names")) {
    if (
      typeof this.last_name === "string" &&
      typeof this.first_names === "string"
    ) {
      this.last_name = capitalizeFirstLetter(this.last_name);
      this.first_names = capitalizeFirstLetter(this.first_names);
      this.last_name = await crypto.encrypt(this.last_name);
      this.first_names = await crypto.encrypt(this.first_names);
    }
  }
  if (this.isModified("email") && typeof this.email === "string") {
    this.email = this.email.toLowerCase();
    this.email = await crypto.encrypt(this.email);
  }
  if (this.isModified("phone") && typeof this.phone === "string") {
    this.phone = await crypto.encrypt(this.phone);
  }
  next();
});

CustomerSessionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update.last_name && typeof update.last_name === "string") {
    update.last_name = await crypto.encrypt(update.last_name);
  }
  if (update.first_names && typeof update.first_names === "string") {
    update.first_names = await crypto.encrypt(update.first_names);
  }
  if (update.email && typeof update.email === "string") {
    update.email = await crypto.encrypt(update.email);
  }
  if (update.phone && typeof update.phone === "string") {
    update.phone = await crypto.encrypt(update.phone);
  }
  next();
});

CustomerSessionSchema.post("find", async function (docs: ICustomerSession[]) {
  await Promise.all(
    docs.map(async (doc: ICustomerSession) => {
      if (typeof doc.last_name === "string") {
        doc.last_name = await crypto.decrypt(doc.last_name);
      }
      if (typeof doc.first_names === "string") {
        doc.first_names = await crypto.decrypt(doc.first_names);
      }
      if (typeof doc.email === "string") {
        doc.email = await crypto.decrypt(doc.email);
      }
      if (typeof doc.phone === "string") {
        doc.phone = await crypto.decrypt(doc.phone);
      }
    })
  );
});

CustomerSessionSchema.post("findOne", async function (doc: ICustomerSession) {
  if (doc) {
    if (doc.last_name && typeof doc.last_name === "string") {
      doc.last_name = await crypto.decrypt(doc.last_name);
    }
    if (doc.first_names && typeof doc.first_names === "string") {
      doc.first_names = await crypto.decrypt(doc.first_names);
    }
    if (doc.email && typeof doc.email === "string") {
      doc.email = await crypto.decrypt(doc.email);
    }
    if (doc.phone && typeof doc.phone === "string") {
      doc.phone = await crypto.decrypt(doc.phone);
    }
  }
});

export const CustomerSession =
  mongoose.models.CustomerSession ||
  mongoose.model<ICustomerSession>("CustomerSession", CustomerSessionSchema);
