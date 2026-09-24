import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "nge_ai_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.AI_ADMIN_TOKEN || "";
}

function safeEqual(left: string, right: string) {
  if (!left || left.length !== right.length) return false;
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

export function isAdminConfigured() {
  return secret().length >= 20;
}

export function verifyAdminToken(received: string) {
  return safeEqual(secret(), received.trim());
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return { value: `v1.${expires}.${signature}`, maxAge: SESSION_TTL_SECONDS };
}

function verifySession(value: string) {
  const [version, expiresText, signature] = value.split(".");
  const expires = Number(expiresText);
  if (version !== "v1" || !Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  const expected = createHmac("sha256", secret()).update(String(expires)).digest("hex");
  return safeEqual(expected, signature || "");
}

export function isAdmin(request: Request) {
  const directToken = request.headers.get("x-admin-token");
  if (directToken && verifyAdminToken(directToken)) return true;
  const cookies = request.headers.get("cookie") || "";
  const session = cookies.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  return session ? verifySession(decodeURIComponent(session)) : false;
}
