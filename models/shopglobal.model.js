import mongoose from "mongoose";

const shopglobal = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  parentCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null } // null for main company
});

export default mongoose.model("Shopglobal", shopglobal);
