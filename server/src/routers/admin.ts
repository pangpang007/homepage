import { Router } from "express";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminRegister,
  handleAdminSession,
} from "../lib/adminHandlers.js";
import { adminUpstreamProxy } from "../lib/adminProxy.js";
import { adminRequireTokenForProtectedPaths } from "../middleware/adminAuth.js";

const router = Router();

router.post("/register", handleAdminRegister);
router.post("/login", handleAdminLogin);
router.post("/logout", handleAdminLogout);
router.get("/session", handleAdminSession);

router.use(adminRequireTokenForProtectedPaths);
router.use(adminUpstreamProxy);

export default router;
