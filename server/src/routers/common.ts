import { Router } from "express";

const router = Router();

router.get("/hello", (_req, res) => {
  res.json({ message: "hello", via: "bff", segment: "common" });
});

export default router;
