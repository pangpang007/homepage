import { existsSync } from "node:fs";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { registerRoutersFromDir } from "./utils/registerApiRouters.js";

dotenv.config({ path: path.join(__dirname, "../.env") });

const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  "https://soupcircle-backend.vercel.app";

const STRIP_API_PREFIX = process.env.BACKEND_STRIP_API_PREFIX === "true";

/** Vercel 上由 CDN 托管 client/dist，仅 serverless 处理 /api；本地生产仍可由 Express 托管静态资源 */
const isVercel = process.env.VERCEL === "1";

function resolveClientDist(): string {
  if (process.env.CLIENT_DIST) {
    return path.resolve(process.env.CLIENT_DIST);
  }
  const fromServerDist = path.resolve(__dirname, "../../client/dist");
  if (existsSync(fromServerDist)) return fromServerDist;
  const fromCwdRoot = path.join(process.cwd(), "client", "dist");
  if (existsSync(fromCwdRoot)) return path.resolve(fromCwdRoot);
  const fromCwdParent = path.join(process.cwd(), "..", "client", "dist");
  if (existsSync(fromCwdParent)) return path.resolve(fromCwdParent);
  return fromServerDist;
}

export async function createApp(): Promise<express.Express> {
  const app = express();

  /**
   * Vercel 把 /api/* 交给本函数时，req.url 往往不带 /api 前缀（如 /common/hello）。
   * 本地与一体化部署仍使用完整路径 /api/...，此处仅在 Vercel 上补齐。
   */
  if (isVercel) {
    app.use((req, _res, next) => {
      const u = req.url ?? "";
      if (u === "" || u === "/" || u.startsWith("/api")) {
        next();
        return;
      }
      req.url = `/api${u}`;
      next();
    });
  }

  app.use(
    cors({
      origin:
        process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? true,
      credentials: true,
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "bff" });
  });

  const apiRouter = express.Router();

  apiRouter.get("/health", (_req, res) => {
    res.json({ ok: true, service: "bff", scope: "api" });
  });

  /** 显式请求远端后端的 GET /hello，供前端一键验证连通性（不经 pathRewrite 代理规则） */
  apiRouter.get("/hello", async (_req, res) => {
    try {
      const target = `${BACKEND_URL}/hello`;
      const r = await fetch(target, {
        headers: { Accept: "text/plain,*/*" },
      });
      const text = await r.text();
      const ct =
        r.headers.get("content-type") || "text/plain; charset=utf-8";
      res.status(r.status).set("Content-Type", ct).send(text);
    } catch {
      res
        .status(502)
        .type("text/plain; charset=utf-8")
        .send("BFF: 无法连接后端 " + BACKEND_URL + "/hello");
    }
  });

  await registerRoutersFromDir(apiRouter);

  apiRouter.use(
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: STRIP_API_PREFIX
        ? undefined
        : (pathname) =>
            pathname === "/" || pathname === "" ? "/api" : `/api${pathname}`,
      on: {
        proxyReq: (_proxyReq, req) => {
          if (process.env.NODE_ENV !== "production") {
            console.log(`[BFF] ${req.method} ${req.url} → ${BACKEND_URL}`);
          }
        },
      },
    })
  );
  app.use("/api", apiRouter);

  const serveStatic =
    process.env.NODE_ENV === "production" && !isVercel;

  if (serveStatic) {
    const clientDist = resolveClientDist();
    app.use(express.static(clientDist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  return app;
}
