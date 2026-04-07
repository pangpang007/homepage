import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Router } from "express";
import { mountApiSegment } from "./mountApiSegments.js";

const defaultRoutersDir = join(__dirname, "../routers");

const requireRouter = createRequire(join(__dirname, "registerApiRouters.js"));

/** TS 在 module=CommonJS 下会把 `import(fileUrl)` 错编成 `require("file://...")`，开发时加载 .ts 用此路径 */
function dynamicImportUrl(href: string): Promise<Record<string, unknown>> {
  return new Function(
    "specifier",
    "return import(specifier)"
  )(href) as Promise<Record<string, unknown>>;
}

function pickRouter(mod: Record<string, unknown>): Router | undefined {
  const d = mod.default;
  if (d && typeof d === "object" && "use" in d && typeof (d as Router).use === "function") {
    return d as Router;
  }
  if (
    d &&
    typeof d === "object" &&
    "default" in d &&
    typeof (d as { default: unknown }).default === "object"
  ) {
    const inner = (d as { default: Router }).default;
    if (inner && typeof inner.use === "function") return inner;
  }
  return undefined;
}

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
    let child: Router | undefined;
    if (file.endsWith(".js")) {
      const mod = requireRouter(fullPath) as Record<string, unknown>;
      child = pickRouter(mod);
    } else {
      const mod = await dynamicImportUrl(pathToFileURL(fullPath).href);
      child = pickRouter(mod);
    }
    if (!child) continue;

    mountApiSegment(apiParent, segment, child);
  }
}
