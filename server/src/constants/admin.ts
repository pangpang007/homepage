export const ADMIN_TOKEN_COOKIE_NAME =
  process.env.ADMIN_TOKEN_COOKIE_NAME ?? "admin_token";

export const ADMIN_COOKIE_MAX_AGE_MS =
  Number(process.env.ADMIN_COOKIE_MAX_AGE_MS) || 1000 * 60 * 60 * 24 * 7;

export const ADMIN_COOKIE_SECURE =
  process.env.ADMIN_COOKIE_SECURE === "true" ||
  process.env.NODE_ENV === "production";

/** 无需校验 token 的路径（相对 `/api/admin` 挂载后的子路径） */
export const ADMIN_PUBLIC_PATHS = new Set([
  "/register",
  "/login",
  "/logout",
  "/session",
]);

export function adminSessionCookieBaseOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
} {
  return {
    httpOnly: true,
    secure: ADMIN_COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
  };
}

export function adminSessionCookieSetOptions(): ReturnType<
  typeof adminSessionCookieBaseOptions
> & { maxAge: number } {
  return {
    ...adminSessionCookieBaseOptions(),
    maxAge: ADMIN_COOKIE_MAX_AGE_MS,
  };
}
