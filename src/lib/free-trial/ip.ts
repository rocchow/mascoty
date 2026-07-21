import { createHash } from "crypto";

const DEFAULT_SALT = "mascoty-ip-salt-v1";

export function getRequestIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "0.0.0.0";
}

export function getRequestUserAgent(request: Request): string {
  return request.headers.get("user-agent")?.slice(0, 400) ?? "";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || DEFAULT_SALT;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

// Free-trial gate key. Pure-IP so a UA change (browser update, in-app
// browser, incognito header quirk) can't reset the daily slot — offices on
// shared NAT get one slot for everyone, which is fine for a free trial.
export function fingerprintRequest(request: Request): string {
  return hashIp(getRequestIp(request));
}
