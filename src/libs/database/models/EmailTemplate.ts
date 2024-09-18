import mongoose, { Schema, model } from "mongoose";
/* Types */
import { IEmailTemplate } from "@/types"


const EmailTemplateSchema: Schema<IEmailTemplate> = new Schema({
  scenario: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);