import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  countryId:{type:mongoose.Schema.Types.ObjectId,ref:"Country",required:true},
  dealType:{type:String,enum:["topdeals","trending","freeshipped","memberexclusives"]},
  address:{type:String,required:true},
  pincode:{type:Number,required:true},
  companyName: { type: String, required: true },
  companyUrl:{type:String,required:true},
  image: { type: String,required:true},
  companyType: {type: String,enum: ["Internal", "External"], required: true },
  description: { type: String },
  companyStatus: { type: Number, enum: [1,2,3,4,5], default: 1 },
  createCompanyDate: { type: Date, default: () => new Date() }
});

export default mongoose.model("Company", companySchema);
