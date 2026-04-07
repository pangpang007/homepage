import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Request, Response } from "express";
import { createApp } from "../server/dist/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  appPromise ??= createApp();
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  app(req as Request, res as Response);
}
