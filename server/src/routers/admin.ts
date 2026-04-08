import { Router } from "express";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminRegister,
  handleAdminSession,
} from "../lib/adminHandlers.js";
import { forwardProtectedAdmin } from "../services/admin.js";
import { adminRequireTokenForProtectedPaths } from "../middleware/adminAuth.js";

const router = Router();

router.post("/register", handleAdminRegister);
router.post("/login", handleAdminLogin);
router.post("/logout", handleAdminLogout);
router.get("/session", handleAdminSession);

router.use(adminRequireTokenForProtectedPaths);
router.use((req, res, next) => {
  forwardProtectedAdmin(req, res).catch(next);
});

export default router;
