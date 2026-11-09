import { NextRequest, NextResponse } from "next/server";

const COUNTER_API = "https://countapi.mileshilliard.com/api/v1";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "";
  const increment = request.nextUrl.searchParams.get("increment") === "1";
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  const key = `ngebuild-project-${slug}`;
  const action = increment ? "hit" : "get";
  try {
    const response = await fetch(`${COUNTER_API}/${action}/${key}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({})) as { value?: number; error?: string };
    if (!response.ok && !increment && payload.error === "Key not found") {
      return NextResponse.json({ value: 0 });
    }
    if (!response.ok || typeof payload.value !== "number") throw new Error("counter_unavailable");
    return NextResponse.json({ value: payload.value });
  } catch {
    return NextResponse.json({ error: "counter_unavailable" }, { status: 502 });
  }
}
