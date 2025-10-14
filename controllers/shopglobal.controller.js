import Shopglobal from "../models/shopglobal.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Shop Global register (main company)
const registerMainCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Shopglobal.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Company already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newCompany = await Shopglobal.create({
      name,
      email,
      password: hashed,
      parentCompany: null, // Main company
    });

    res.status(201).json({ msg: "Company registered", company: newCompany });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login (main or subsidiary)
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Shopglobal.findOne({ email }).populate("parentCompany", "name email");
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { companyId: company._id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const getAllShoppingGlobal = async (req, res) => {
  try {
    const companies = await Shopglobal.find().select("-password");
    res.status(200).json({shopglobal: companies });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export default {
  registerMainCompany,
  loginCompany,
  getAllShoppingGlobal
};
