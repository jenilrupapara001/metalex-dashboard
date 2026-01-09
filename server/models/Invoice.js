import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    preparedBy: {
      type: String,
      default: 'Admin',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected'],
      default: 'draft',
    },
    items: [
      {
        id: String,
        position: Number,
        quantity: Number,
        description: String,
        width: Number,
        height: Number,
        areaSqft: Number,
        pricePerSqft: Number,
        total: Number,
        remarks: String,
        technicalDetails: {
          type: mongoose.Schema.Types.Mixed,
          default: {
            type: 'Standard',
            system: 'Aluminium',
            finish: 'Powder Coated',
            glazing: 'Double Glazing',
            hardware: 'Stainless Steel',
          },
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    freight: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    termsAndConditions: [String],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);
