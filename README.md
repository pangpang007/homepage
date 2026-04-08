# Soupcircle 个人主页

React + React Router 前端，Express BFF 将 `/api` 转发到后端  
`https://soupcircle-backend.vercel.app`（可用环境变量覆盖）。

## 开发

```bash
npm install
npm run dev
```

- 前端：<http://localhost:5173>（`/api` 会代理到本机 BFF）
- BFF：<http://localhost:4001>（`GET /health`、`GET /api/hello` 转发远端 `GET /hello`、`GET /api/common/hello` 等）

## 生产构建与启动

```bash
npm run build
NODE_ENV=production npm start
```

生产模式下 Express 会托管 `client/dist` 并保留 `/api` 代理。

## 配置

复制 `server/.env.example` 为 `server/.env`，按需修改 `BACKEND_URL`、`BACKEND_STRIP_API_PREFIX`（后端若无 `/api` 前缀则设为 `true`）。

## 目录

- `client/` — Vite + React + React Router
- `server/` — Express BFF（`src/routers` 各模块路由，`src/utils` 含 `mountApiSegment` 与 `registerRoutersFromDir`）
- `api/[[...path]].ts` — Vercel Serverless 入口，复用 `server` 编译产物中的 `createApp`

更完整的结构说明、路由约定与环境变量汇总见 [`docs/PROJECT.md`](docs/PROJECT.md)。

## 部署到 Vercel

1. 把本仓库推送到 **GitHub / GitLab / Bitbucket**（或 Vercel 支持的 Git 托管）。
2. 打开 [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project** → **Import** 你的仓库。
3. **Root Directory** 保持仓库根目录（不要选 `client` / `server` 子目录）。
4. 框架可识别为 **Other**；构建与输出已由根目录 [`vercel.json`](vercel.json) 指定：
   - `npm install` + `npm run build`（先构建前端 `client/dist`，再编译 `server/dist`）
   - 静态站点输出目录：`client/dist`
   - `/api/*` 由根目录 `api/[[...path]].ts`（Vercel 可选 catch-all）中的 Express BFF 处理，并通过 `includeFiles` 带上 `server/dist` 下的动态路由文件
5. 在 Vercel 项目 **Settings → Environment Variables** 中按需配置（与本地 `server/.env` 类似）：
   - `BACKEND_URL` — 默认若不设则仍为 `https://soupcircle-backend.vercel.app`
   - `BACKEND_STRIP_API_PREFIX` — 若远端 API 无 `/api` 前缀则设为 `true`
   - `CORS_ORIGIN` — 仅当跨域访问 BFF 时需要；同域部署一般可不设
6. 保存后 **Deploy**。生产环境前端与 `/api` 同源，无需再配 `VITE_BFF_URL`。

本地用 Vercel CLI 预览：`npx vercel` 链接项目后执行 `npx vercel dev`（需已登录 CLI）。

**说明**：在 Vercel 上静态页面由 CDN 提供，BFF 不托管 `client/dist`；本地 `NODE_ENV=production npm start` 仍可由单个 Node 进程同时托管静态资源 + API。

**Serverless 与本地差异**：Vercel 会把 `api/*.ts` 编成 CommonJS（`require`）。`server` 侧也编译为 CommonJS，才能被 `require("../server/dist/app.js")` 正常加载；若曾出现 `FUNCTION_INVOCATION_FAILED`，多与 ESM/CJS 混用或动态路由加载方式有关（当前仓库已按此对齐）。
