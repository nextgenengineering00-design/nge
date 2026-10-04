import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const hostname = request.nextUrl.hostname.toLowerCase();
  const isProductionHost = hostname === "ngebuild.com" || hostname === "www.ngebuild.com";

  if (!isProductionHost) return NextResponse.next();
  if (forwardedProto === "https" && hostname === "ngebuild.com") return NextResponse.next();

  const canonical = `https://ngebuild.com${request.nextUrl.pathname}${request.nextUrl.search}`;
  return new Response(null, { status: 308, headers: { Location: canonical } });
}

export const config = { matcher: "/:path*" };
