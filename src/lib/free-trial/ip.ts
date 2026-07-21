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

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || DEFAULT_SALT;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
