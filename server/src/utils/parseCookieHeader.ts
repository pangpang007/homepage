export function parseCookieHeader(
  raw: string | undefined
): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k || rest.length === 0) continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}
