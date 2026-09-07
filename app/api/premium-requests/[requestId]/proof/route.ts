import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

/**
 * The only Route Handler in this app — everything else is a Server Action.
 * A proof-of-payment image/PDF needs to be streamed straight into an <img>
 * or <a href>, which can't attach an Authorization header the way a fetch
 * from a Server Component/Action can, so this proxies the raw bytes through
 * admin-web's own origin (with the access token attached server-side) —
 * the backend's URL and auth scheme stay invisible to the browser either way.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const upstream = await fetch(`${API_URL}/api/v1/admin/premium-requests/${requestId}/proof`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "not found" }, { status: upstream.status || 404 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60",
    },
  });
}
