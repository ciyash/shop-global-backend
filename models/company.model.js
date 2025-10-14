// models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  projects: {
    type: Map,
    of: {
      enabled: { type: Boolean, default: false },
        membershipStartDate: { type: Date, default: Date.now },
       membershipEndDate: { type: Date },
    },
    default: {}
  },
  isBlocked: { type: Boolean, default: false },
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shopglobal",
    default: null
  },
  lastLoginIp: { type: String, default: null },

  subscription: {
    type: {
      plan: {
        type: String,
        enum: ['monthly', 'half-yearly', 'yearly'],
        required: true
      },
      validTill: {
        type: Date,
        required: true
      }
    },
    required: true
  }
});

export default mongoose.model("Company", companySchema);
