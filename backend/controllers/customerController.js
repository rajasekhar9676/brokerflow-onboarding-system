import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

export const createCustomerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("gstin").trim().notEmpty().withMessage("GSTIN is required"),
];

export const createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
    }

    const { name, email, gstin } = req.body;
    const brokerId = req.user.id;

    const customer = await prisma.customer.create({
      data: { name: name.trim(), email, gstin: gstin.trim(), brokerId },
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { customer },
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { brokerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: { customers } });
  } catch (err) {
    next(err);
  }
};
