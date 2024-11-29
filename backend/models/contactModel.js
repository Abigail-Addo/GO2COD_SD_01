import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "The name field is required."],
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    last_name: {
      type: String,
      trim: true,
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const contact = mongoose.model("Contact", contactSchema);

export default contact;
