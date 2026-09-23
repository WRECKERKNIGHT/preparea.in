import { ok, clearSessionCookie } from "@/lib/api";

export async function POST() {
  const res = ok({ loggedOut: true });
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}