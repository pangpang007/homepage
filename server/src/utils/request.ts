import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { BACKEND_URL, STRIP_API_PREFIX } from "../constants/backend.js";

/** 与 Express 的 `Response` 区分，指 `fetch()` 的返回值 */
export type FetchResponse = globalThis.Response;

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-connection",
  "transfer-encoding",
  "upgrade",
]);

export class BackendFetchError extends Error {
  constructor(message = "BFF: 无法连接后端") {
    super(message);
    this.name = "BackendFetchError";
  }
}

export function bffPathToBackendPath(pathname: string, search: string): string {
  const pathSeg =
    pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (STRIP_API_PREFIX) {
    return pathSeg + search;
  }
  if (pathSeg === "/") {
    return "/api" + search;
  }
  return `/api${pathSeg}` + search;
}

export function searchFromReqUrl(url: string): string {
  const i = url.indexOf("?");
  return i === -1 ? "" : url.slice(i);
}

function isWebReadableStream(body: unknown): body is ReadableStream {
  return typeof ReadableStream !== "undefined" && body instanceof ReadableStream;
}

function buildOutboundHeaders(req: ExpressRequest): Headers {
  const h = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    const kl = key.toLowerCase();
    if (HOP_BY_HOP.has(kl)) continue;
    if (kl === "host") continue;
    if (kl === "cookie") continue;
    if (kl === "content-length") continue;
    const v = Array.isArray(value) ? value.join(",") : value;
    h.set(key, v);
  }
  if (!h.has("accept")) {
    h.set("accept", "*/*");
  }
  return h;
}

function buildOutboundBody(req: ExpressRequest): BodyInit | undefined {
  const m = req.method;
  if (m === "GET" || m === "HEAD") return undefined;
  const ct = String(req.headers["content-type"] ?? "");
  if (ct.includes("application/json")) {
    return JSON.stringify(req.body ?? {});
  }
  return Readable.toWeb(
    req as unknown as import("node:stream").Readable
  ) as unknown as BodyInit;
}

export async function writeUpstreamToExpress(
  upstream: FetchResponse,
  res: ExpressResponse
): Promise<void> {
  res.status(upstream.status);
  upstream.headers.forEach((value: string, key: string) => {
    const kl = key.toLowerCase();
    if (HOP_BY_HOP.has(kl)) return;
    if (kl === "set-cookie") {
      res.appendHeader(key, value);
      return;
    }
    res.setHeader(key, value);
  });
  if (!upstream.body) {
    res.end();
    return;
  }
  await pipeline(
    Readable.fromWeb(upstream.body as import("stream/web").ReadableStream),
    res
  );
}

export type BackendRequestInput = {
  method: string;
  /** 后端路径，须以 / 开头 */
  path: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  bearerToken?: string;
};

/**
 * 统一 `fetch` 后端：可附加 Bearer，网络失败抛 BackendFetchError。
 */
export async function request(input: BackendRequestInput): Promise<FetchResponse> {
  const p = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = `${BACKEND_URL}${p}`;
  const headers = new Headers(input.headers);
  if (input.bearerToken) {
    headers.set("Authorization", `Bearer ${input.bearerToken}`);
  }
  const body = input.body ?? undefined;
  const init: RequestInit = {
    method: input.method,
    headers,
    body: body ?? undefined,
  };
  if (isWebReadableStream(body)) {
    Object.assign(init, { duplex: "half" as const });
  }
  try {
    return await fetch(url, init);
  } catch {
    throw new BackendFetchError();
  }
}

/**
 * 将当前 Express 请求转发到后端（路径已解析为后端路径），响应流式写回客户端。
 */
export async function forwardExpressToBackend(
  req: ExpressRequest,
  res: ExpressResponse,
  options: { backendPath: string }
): Promise<void> {
  const headers = buildOutboundHeaders(req);
  const body = buildOutboundBody(req);
  const init: RequestInit = {
    method: req.method,
    headers,
    body: body ?? undefined,
  };
  if (isWebReadableStream(body)) {
    Object.assign(init, { duplex: "half" as const });
  }
  let upstream: FetchResponse;
  try {
    upstream = await fetch(`${BACKEND_URL}${options.backendPath}`, init);
  } catch {
    res.status(502).json({ detail: "BFF: 无法连接后端" });
    return;
  }
  try {
    await writeUpstreamToExpress(upstream, res);
  } catch {
    if (!res.headersSent) {
      res.status(502).end();
    }
  }
}

/**
 * 将 `/api` 子路由上未单独实现的请求转发到远端（兼容原 pathRewrite 规则）。
 */
export async function forwardGenericBffApi(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const search = searchFromReqUrl(req.url);
  const backendPath = bffPathToBackendPath(req.path, search);
  await forwardExpressToBackend(req, res, { backendPath });
}
