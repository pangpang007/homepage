import type { Request, Response } from "express";
import {
  ADMIN_TOKEN_COOKIE_NAME,
  adminSessionCookieBaseOptions,
  adminSessionCookieSetOptions,
} from "../constants/admin.js";
import {
  adminLogin,
  adminRegister,
  parseAdminLoginJson,
} from "../services/admin.js";
import { getAdminTokenFromRequest } from "../utils/adminToken.js";

export async function handleAdminRegister(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const r = await adminRegister(req.body);
    const text = await r.text();
    const ct =
      r.headers.get("content-type") ?? "application/json; charset=utf-8";
    res.status(r.status).set("Content-Type", ct).send(text);
  } catch {
    res.status(502).json({ detail: "BFF: 无法连接后端 /admin/register" });
  }
}

export async function handleAdminLogin(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const r = await adminLogin(req.body);
    const text = await r.text();
    if (!r.ok) {
      const ct =
        r.headers.get("content-type") ?? "application/json; charset=utf-8";
      res.status(r.status).set("Content-Type", ct).send(text);
      return;
    }
    const data = parseAdminLoginJson(text);
    if (!data?.token) {
      res.status(502).json({ detail: "BFF: 后端登录响应缺少 token" });
      return;
    }
    res.cookie(ADMIN_TOKEN_COOKIE_NAME, data.token, adminSessionCookieSetOptions());
    res.json({ uid: data.uid, email: data.email });
  } catch {
    res.status(502).json({ detail: "BFF: 无法连接后端 /admin/login" });
  }
}

export function handleAdminLogout(_req: Request, res: Response): void {
  res.clearCookie(ADMIN_TOKEN_COOKIE_NAME, adminSessionCookieBaseOptions());
  res.json({ ok: true });
}

export function handleAdminSession(req: Request, res: Response): void {
  res.json({ authenticated: Boolean(getAdminTokenFromRequest(req)) });
}
