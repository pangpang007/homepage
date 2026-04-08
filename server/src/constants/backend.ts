export const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  "https://soupcircle-backend.vercel.app";

export const STRIP_API_PREFIX =
  process.env.BACKEND_STRIP_API_PREFIX === "true";
