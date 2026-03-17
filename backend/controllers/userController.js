import { prisma } from "../lib/prisma.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { customers: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: { users } });
  } catch (err) {
    next(err);
  }
};
