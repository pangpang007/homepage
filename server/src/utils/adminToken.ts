import type { Request } from "express";
import { ADMIN_TOKEN_COOKIE_NAME } from "../constants/admin.js";
import { parseCookieHeader } from "./parseCookieHeader.js";

export function getAdminTokenFromRequest(req: Request): string | undefined {
  const token = parseCookieHeader(req.headers.cookie)[ADMIN_TOKEN_COOKIE_NAME];
  return token?.trim() || undefined;
}

export function getAdminTokenFromCookieHeader(
  cookieHeader: string | undefined
): string | undefined {
  const token = parseCookieHeader(cookieHeader)[ADMIN_TOKEN_COOKIE_NAME];
  return token?.trim() || undefined;
}
