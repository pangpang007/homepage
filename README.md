# 刘岩 · 个人主页

面向招聘方的 Web3 风格个人介绍站点，基于 **Next.js 16**（App Router）与 **Tailwind CSS v4**，可部署在 [Vercel](https://vercel.com)。

设计规范见 [design-system/MASTER.md](design-system/MASTER.md)。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

复制 `.env.example` 为 `.env.local`：

- `NEXT_PUBLIC_SITE_URL`：生产站点完整 URL（用于 `metadataBase` 与社交分享链接）。
- `NEXT_PUBLIC_GITHUB_URL`：可选，设置后显示 GitHub 入口。

## 简历 PDF

将文件命名为 `resume.pdf` 并放在 `public/` 目录下，首页「下载简历 PDF」链接即可生效。

## 部署到 Vercel

1. 将仓库推送到 GitHub / GitLab / Bitbucket。
2. 在 Vercel 导入项目，框架自动识别 Next.js。
3. 在 Project → Settings → Environment Variables 中配置 `NEXT_PUBLIC_SITE_URL`（及可选的 `NEXT_PUBLIC_GITHUB_URL`），重新部署。

## 脚本

- `npm run dev` — 开发服务器
- `npm run build` — 生产构建
- `npm run start` — 启动生产服务
- `npm run lint` — ESLint
