import express from "express";
import {
  createCustomer,
  getMyCustomers,
  createCustomerValidation,
} from "../controllers/customerController.js";
import { protect, brokerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(brokerOnly);

router.post("/", createCustomerValidation, createCustomer);
router.get("/", getMyCustomers);

export default router;
