import { createProxyMiddleware } from "http-proxy-middleware";
import { BACKEND_URL } from "../constants/admin.js";
import { getAdminTokenFromCookieHeader } from "../utils/adminToken.js";

export const adminUpstreamProxy = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: (pathname) => `/admin${pathname}`,
  on: {
    proxyReq: (proxyReq, req) => {
      const token = getAdminTokenFromCookieHeader(req.headers.cookie);
      if (token) {
        proxyReq.setHeader("Authorization", `Bearer ${token}`);
      }
    },
  },
});
