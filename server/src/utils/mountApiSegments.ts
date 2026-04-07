import type { Router } from "express";

/**
 * 将 `segment`（与 `routers/` 下模块文件名一致，如 `common`）挂到已挂载在 `/api` 下的父 router。
 * 子 router 内定义 `GET /hello` 时，对外路径为 `/api/<segment>/hello`。
 */
export function mountApiSegment(
  apiParent: Router,
  segment: string,
  router: Router
): void {
  apiParent.use(`/${segment}`, router);
}
