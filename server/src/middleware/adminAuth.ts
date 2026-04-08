import type { RequestHandler } from "express";
import { ADMIN_PUBLIC_PATHS } from "../constants/admin.js";
import { getAdminTokenFromRequest } from "../utils/adminToken.js";

/**
 * 对非公开 admin 子路径要求 HttpOnly cookie 中的 token，并写入 Authorization。
 */
export const adminRequireTokenForProtectedPaths: RequestHandler = (
  req,
  res,
  next
) => {
  if (ADMIN_PUBLIC_PATHS.has(req.path)) {
    next();
    return;
  }
  const token = getAdminTokenFromRequest(req);
  if (!token) {
    res.status(401).json({
      detail: "Unauthorized: missing admin token cookie",
    });
    return;
  }
  req.headers.authorization = `Bearer ${token}`;
  next();
};
