import express from "express";
import shopglobalController from "../controllers/shopglobal.controller.js";

const router = express.Router();

router.post("/main/register", shopglobalController.registerMainCompany); // Shop Global

router.post("/main/login", shopglobalController.loginCompany);

router.get("/", shopglobalController.getAllShoppingGlobal); // Get all companies

export default router;
