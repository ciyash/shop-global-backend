import express from "express";
import companyController from '../controllers/company.controller.js';

const router = express.Router();

// Shopglobal (parent) creates subsidiary company
router.post("/subsidiary/register", companyController.registerSubsidiary);

// Subsidiary login
router.post("/subsidiary/login", companyController.loginCompany);

// Get subsidiary companies for a parent company (Shopglobal)
router.get("/subsidiaries/:parentCompanyId", companyController.getSubsidiaries);

// Toggle project access for a company (parent or subsidiary)
router.post("/toggle-project", companyController.toggleProjectAccess);

// Validate project access
router.post("/status/validate-access/", companyController.validateProjectAccess);

router.delete("/delete/:id", companyController.deleteCompany);

router.post("/subscription", companyController.setSubscription);

router.get("/check/membership/:companyId", companyController.checkMembershipStatus);

router.delete("/all-delete", companyController.deleteAllCompanies);

export default router;
