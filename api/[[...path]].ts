import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/dist/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  appPromise ??= createApp();
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  app(req as Parameters<typeof app>[0], res as Parameters<typeof app>[1]);
}
