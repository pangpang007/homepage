# 项目基础说明

本文档描述本仓库的目录结构、技术栈、运行方式与约定，便于后续维护与扩展。

## 概述

- **类型**：npm workspaces 单体仓库（`client` + `server`）。
- **前端**：Vite 6 + React 18 + React Router 6，页面与布局组件采用「同名文件夹 + `index.tsx` + `index.module.less`」组织方式，路径别名 `@` 指向 `client/src`。
- **BFF**：Express 4，挂载在 `/api` 下；未命中的路径由 `utils/request.ts` 中的工具函数用 `fetch` 转发到远端后端（见下文）。
- **部署**：Vercel 上由静态资源（`client/dist`）+ Serverless 函数（`api/[[...path]].ts`）复用同一套 `createApp()` 逻辑。

后端 API 契约见独立仓库文档（例如 `homepage_backend/docs/API.md`）：注册/登录密码字段需按文档做传输层加密。

## 仓库目录结构（要点）

```
homepage/
├── package.json              # workspaces 根脚本：dev / build / start
├── vercel.json               # Vercel 构建、outputDirectory、/api 函数 includeFiles
├── api/
│   └── [[...path]].ts        # Vercel：将请求交给 server 编译后的 createApp
├── docs/
│   └── PROJECT.md            # 本文件
├── client/                   # 前端 workspace
│   ├── vite.config.ts        # 别名 @、开发时 /api → BFF 代理
│   ├── src/
│   │   ├── App.tsx           # 路由入口
│   │   ├── main.tsx
│   │   ├── index.css         # 全局样式（非 CSS Module）
│   │   ├── components/       # 按文件夹组织，如 Layout/
│   │   ├── pages/            # 页面同理，如 Home/、About/、Admin/
│   │   └── utils/            # 如 passwordTransfer（admin 密码加密）
│   └── .env.example
└── server/                   # BFF workspace
    ├── src/
    │   ├── index.ts          # 本地 listen（默认 PORT 见 .env.example）
    │   ├── app.ts            # Express 应用组装、/api 下 hello 与兜底转发
    │   ├── constants/        # backend、admin 等常量
    │   ├── services/         # admin、common：调用后端的业务封装
    │   ├── lib/              # 如 adminHandlers
    │   ├── middleware/       # 如 admin 鉴权中间件
    │   ├── routers/          # 按文件扫描挂载到 /api/<segment>
    │   └── utils/            # request（fetch/转发）、registerApiRouters、mountApiSegments、parseCookieHeader 等
    └── .env.example
```

## 根目录脚本

| 命令 | 说明 |
|------|------|
| `npm install` | 在仓库根安装，安装所有 workspace 依赖 |
| `npm run dev` | 并行启动 `client`（Vite）与 `server`（BFF watch） |
| `npm run build` | 先 `client` 生产构建，再编译 `server` 到 `server/dist` |
| `npm start` | 运行 `server` 的 `node dist/index.js`（需先 build） |
| `npm run preview` | 仅预览已构建的前端静态产物 |

## 本地开发端口与代理

- **前端开发服务器**：`http://localhost:5173`（`client/vite.config.ts`）。
- **BFF**：默认 `http://localhost:4001`（`server/.env.example` 中 `PORT`，可被环境变量覆盖）。
- 开发时浏览器请求同源 `/api/*`，由 Vite `server.proxy` 转发到 `VITE_BFF_URL`（未设置时默认为 `http://localhost:4001`）。

生产部署到 Vercel 且前后端同源时，一般**不需要**配置 `VITE_BFF_URL`。

## BFF 路由约定

1. **顶层应用**
   - `GET /health`：BFF 健康检查。
   - `app.use("/api", apiRouter)` 下：
     - `GET /api/health`：API 域健康检查。
     - `GET /api/hello`：BFF 主动请求远端 `GET /hello`（用于连通性演示）。

2. **按文件扫描的路由**（`server/src/utils/registerApiRouters.ts`）
   - `server/src/routers/<segment>.ts` 默认导出 `Router`，挂载为 **`/api/<segment>/...`**。
   - 示例：`routers/common.ts` → `/api/common/hello`。
   - 文件名 `index` 或以 `_` 开头会被跳过。

3. **Admin 模块**（`routers/admin.ts`）
   - 对外前缀：`/api/admin`。
   - 注册/登录等由 `services/admin.ts`（内部使用 `utils/request.ts` 的 `request()`）调远端；路由与 Cookie 逻辑在 `lib/adminHandlers.ts`、`middleware/`、`utils/adminToken` 等。
   - 典型路径：
     - `POST /api/admin/register`、`POST /api/admin/login`：转发远端；登录成功后将 JWT 写入 **HttpOnly** Cookie。
     - `POST /api/admin/logout`、`GET /api/admin/session`：登出与会话探测。
     - 其余 `/api/admin/*`：先校验 Cookie 中 token 并写入 `Authorization`，再经 `forwardExpressToBackend` 转发到远端 `/admin/*`。

4. **兜底转发**
   - 在 `registerRoutersFromDir` 之后，`app.ts` 对仍未处理的 `/api` 请求调用 `forwardGenericBffApi()`（`utils/request.ts`），按 `BACKEND_STRIP_API_PREFIX` 将 BFF 路径映射为远端路径后用 `fetch` 流式回写响应。

## 前端路由（当前）

在 `client/src/App.tsx` 中（均在 `Layout` 内）：

- `/` → Home  
- `/about` → About  
- `/admin` → Admin（注册/登录等，请求上述 BFF `/api/admin/...`）

## 环境变量

### `server`（复制 `server/.env.example` → `server/.env`）

| 变量 | 说明 |
|------|------|
| `PORT` | BFF 监听端口，默认 `4001` |
| `BACKEND_URL` | 远端后端根 URL，无尾部 `/` |
| `BACKEND_STRIP_API_PREFIX` | 为 `true` 时，兜底转发不向路径前加 `/api` |
| `CORS_ORIGIN` | 逗号分隔允许来源；不设时开发期多为宽松策略 |
| `ADMIN_TOKEN_COOKIE_NAME` | 存 JWT 的 Cookie 名 |
| `ADMIN_COOKIE_MAX_AGE_MS` | Cookie `maxAge`（毫秒） |
| `ADMIN_COOKIE_SECURE` | 是否 `Secure` Cookie（生产默认可配合环境） |
| `VERCEL` | Vercel 运行时由平台注入；`app.ts` 用于修正 `req.url` 前缀行为 |
| `CLIENT_DIST` | 可选，指定生产静态资源目录 |

### `client`（参考 `client/.env.example`）

| 变量 | 说明 |
|------|------|
| `VITE_PASSWORD_TRANSFER_KEY` | 与后端 `PASSWORD_TRANSFER_KEY` 一致的 base64url（解码后 32 字节），用于注册/登录前密码加密 |
| `VITE_BFF_URL` | 可选，仅本地 Vite 代理 BFF 地址 |

## Vercel 部署要点

- **Root Directory**：仓库根（勿选 `client` 或 `server` 单独目录）。
- `vercel.json`：`buildCommand` 执行根目录 `npm run build`；`outputDirectory` 为 `client/dist`；`api/[[...path]].ts` 通过 `includeFiles` 带上 `server/dist/**`。
- 线上静态页由 CDN 提供；`/api/*` 进入 Serverless 中的 Express，与本地 BFF 逻辑一致。
- **路径说明**：在部分 Serverless 入口下，挂载在 `/api` 下的子 Router 仍可能收到带 `/api` 前缀的 `req.url`。`server/src/app.ts` 会在 `apiRouter` 入口剥掉多余 `/api`，避免无法匹配 `routers/admin` 等子路由。

更逐步的部署说明仍见根目录 [README.md](../README.md)。

## 相关文档

- 根目录 [README.md](../README.md)：开发与 Vercel 步骤摘要。
- 后端接口与密码传输规则：独立仓库中的 `docs/API.md`（路径以你本机 `homepage_backend` 为准）。
