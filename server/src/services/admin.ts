import type { Request, Response } from "express";
import {
  forwardExpressToBackend,
  request,
  searchFromReqUrl,
  type FetchResponse,
} from "../utils/request.js";

export async function adminRegister(body: unknown): Promise<FetchResponse> {
  return request({
    method: "POST",
    path: "/admin/register",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
}

export async function adminLogin(body: unknown): Promise<FetchResponse> {
  return request({
    method: "POST",
    path: "/admin/login",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
}

export type AdminLoginSuccessBody = {
  uid?: string;
  email?: string;
  token?: string;
};

export function parseAdminLoginJson(text: string): AdminLoginSuccessBody | null {
  try {
    return JSON.parse(text) as AdminLoginSuccessBody;
  } catch {
    return null;
  }
}

/**
 * 将受保护的 `/api/admin/*` 转发到远端 `/admin/*`。
 * 依赖上游中间件写入 `Authorization: Bearer …`（与 Cookie 中 token 一致）。
 */
export async function forwardProtectedAdmin(
  req: Request,
  res: Response
): Promise<void> {
  const search = searchFromReqUrl(req.url);
  const adminPath = req.path === "/" ? "/admin" : `/admin${req.path}`;
  await forwardExpressToBackend(req, res, { backendPath: adminPath + search });
}
