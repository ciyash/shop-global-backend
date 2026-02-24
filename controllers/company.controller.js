import Company from "../models/company.model.js";
import Shopglobal from "../models/shopglobal.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const registerSubsidiaryCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      parentCompanyId,
      phone,
      address,
      state,
      customerName
    } = req.body;

    const existing = await Company.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Company already exists" });

    const parentCompany = await Shopglobal.findById(parentCompanyId);
    if (!parentCompany) return res.status(404).json({ msg: "Parent company not found" });

    const hashed = await bcrypt.hash(password, 10);

    const newCompany = await Company.create({
      name,
      email,
      password: hashed,
      phone,
      address,
      state,
      customerName,
      projects: {},
      parentCompany: parentCompanyId
    });

    res.status(201).json({ msg: "Subsidiary registered", company: newCompany });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const company = await Company.findOne({ email }).populate("parentCompany", "name email");
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (company.isBlocked) {
      return res.status(403).json({ msg: "Company is blocked" });
    }

    // ✅ Only update IP
    company.lastLoginIp = ipAddress;
    await company.save();

    const tokenPayload = {
      companyId: company._id.toString(),               // ఈ company id
      email: company.email,
      shopGlobalId: company.parentCompany?._id.toString() || null, // parentCompany ID
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const setSubscription = async (req, res) => {
  try {
    const { companyId, plan } = req.body;
    const durationMap = {
      monthly: 30,
      "half-yearly": 182,
      yearly: 365
    };

    if (!durationMap[plan]) {
      return res.status(400).json({ msg: "Invalid plan" });
    }

    const validTill = new Date(Date.now() + durationMap[plan] * 24 * 60 * 60 * 1000);

    const company = await Company.findByIdAndUpdate(
      companyId,
      { subscription: { plan, validTill } },
      { new: true }
    );

    if (!company) return res.status(404).json({ msg: "Company not found" });

    res.json({ msg: "Subscription updated", subscription: company.subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getSubsidiaries = async (req, res) => {
  try {
    const { parentCompanyId } = req.params;

    // Find all companies whose parentCompany is this id
    const subsidiaries = await Company.find({ parentCompany: parentCompanyId });

    res.json({ subsidiaries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const toggleProjectAccess = async (req, res) => {
  try {
    const { companyId, projectKey, enable } = req.body;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    company.projects.set(projectKey, {
      enabled: enable,
      validTill: enable
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null,
    });

    await company.save();

    res.json({
      msg: `Access to ${projectKey} ${enable ? "enabled" : "disabled"}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validateProjectAccess = async (req, res) => {
  try {
    const { companyId, projectKey } = req.body;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ allowed: false });

    const project = company.projects.get(projectKey);

    const allowed =
      project?.enabled &&
      project?.validTill &&
      new Date(project.validTill) > new Date() &&
      !company.isBlocked;

    res.json({ allowed });
  } catch (err) {
    res.status(500).json({ allowed: false });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    await Company.findByIdAndDelete(id);

    res.json({ msg: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkMembershipStatus = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company || !company.subscription?.validTill) {
      return res.json({ hasActiveMembership: false });
    }

    const isActive = new Date(company.subscription.validTill) > new Date();

    res.json({ hasActiveMembership: isActive });
  } catch (err) {
    res.status(500).json({ hasActiveMembership: false });
  }
};

const deleteAllCompanies = async (req, res) => {
  try {
    await Company.deleteMany({});
    res.json({ msg: "All companies deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
   
    registerSubsidiary: registerSubsidiaryCompany,
    loginCompany,
    getSubsidiaries,
    toggleProjectAccess,
    validateProjectAccess,
    deleteCompany,
    setSubscription,
    checkMembershipStatus,
    deleteAllCompanies
};
