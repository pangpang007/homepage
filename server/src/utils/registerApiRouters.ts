import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Router } from "express";
import { mountApiSegment } from "./mountApiSegments.js";

const defaultRoutersDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../routers"
);

const SKIP = new Set(["index"]);

/**
 * 扫描 `routersDir` 下的 `*.ts` / `*.js`，按**文件名（不含扩展名）**作为 `/api` 下的一级路径，
 * 将模块的 `default`（Express Router）挂到 `/api/<文件名>/...`。
 */
export async function registerRoutersFromDir(
  apiParent: Router,
  routersDir: string = defaultRoutersDir
): Promise<void> {
  for (const file of readdirSync(routersDir)) {
    const m = file.match(/^(.+)\.(ts|js)$/);
    if (!m) continue;
    const segment = m[1];
    if (SKIP.has(segment) || segment.startsWith("_")) continue;

    const fullPath = join(routersDir, file);
    const mod = await import(pathToFileURL(fullPath).href);
    const child = mod.default as Router | undefined;
    if (!child) continue;

    mountApiSegment(apiParent, segment, child);
  }
}
