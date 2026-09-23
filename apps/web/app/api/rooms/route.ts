import { ok, err, getSession } from "@/lib/api";
import { getStore } from "@/lib/store";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to see study rooms.", 401);
  const rooms = await getStore().getRooms();
  return ok(rooms);
}