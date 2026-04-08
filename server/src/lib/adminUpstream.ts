import { BACKEND_URL } from "../constants/admin.js";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

export async function postAdminRegister(body: unknown): Promise<Response> {
  return fetch(`${BACKEND_URL}/admin/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body ?? {}),
  });
}

export async function postAdminLogin(body: unknown): Promise<Response> {
  return fetch(`${BACKEND_URL}/admin/login`, {
    method: "POST",
    headers: JSON_HEADERS,
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
