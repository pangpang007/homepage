import { existsSync } from "node:fs";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { BACKEND_URL } from "./constants/backend.js";
import { fetchBackendHello } from "./services/common.js";
import {
  BackendFetchError,
  forwardGenericBffApi,
} from "./utils/request.js";
import { registerRoutersFromDir } from "./utils/registerApiRouters.js";

dotenv.config({ path: path.join(__dirname, "../.env") });

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
      let u = req.url ?? "";
      if (u !== "" && !u.startsWith("/")) {
        u = `/${u}`;
        req.url = u;
      }
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
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "bff" });
  });

  const apiRouter = express.Router();

  /**
   * 部分 Serverless 入口里，`app.use("/api", apiRouter)` 之后 `req.url` 仍可能带一层 `/api/...`，
   * 导致无法匹配 `use("/admin", ...)` 等子路由，请求落入兜底代理并被 pathRewrite 成后端 `/api/admin/...`
   *（而后端实际是 `/admin/...`），表现为 404。此处统一剥掉多余前缀。
   */
  apiRouter.use((req, _res, next) => {
    const raw = req.url ?? "";
    const qIdx = raw.indexOf("?");
    const pathPart = qIdx === -1 ? raw : raw.slice(0, qIdx);
    const query = qIdx === -1 ? "" : raw.slice(qIdx);
    if (pathPart === "/api" || pathPart.startsWith("/api/")) {
      const stripped =
        pathPart === "/api" ? "/" : pathPart.slice("/api".length) || "/";
      req.url = stripped + query;
    }
    next();
  });

  apiRouter.get("/health", (_req, res) => {
    res.json({ ok: true, service: "bff", scope: "api" });
  });

  /** 显式请求远端后端的 GET /hello，供前端一键验证连通性 */
  apiRouter.get("/hello", async (_req, res) => {
    try {
      const r = await fetchBackendHello();
      const text = await r.text();
      const ct =
        r.headers.get("content-type") || "text/plain; charset=utf-8";
      res.status(r.status).set("Content-Type", ct).send(text);
    } catch (e) {
      if (e instanceof BackendFetchError) {
        res
          .status(502)
          .type("text/plain; charset=utf-8")
          .send("BFF: 无法连接后端 " + BACKEND_URL + "/hello");
        return;
      }
      throw e;
    }
  });

  await registerRoutersFromDir(apiRouter);

  apiRouter.use((req, res, next) => {
    forwardGenericBffApi(req, res).catch(next);
  });

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
