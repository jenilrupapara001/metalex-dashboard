import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    gstin: String,
    pan: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Client', clientSchema);
