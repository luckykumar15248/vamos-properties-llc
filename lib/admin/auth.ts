import "server-only";

import { connection } from "next/server";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/admin/session";
import { findUserById, type AdminActor } from "@/lib/dal/users";

export async function requireAdmin(): Promise<AdminActor> {
  await connection();
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const user = await findUserById(session.uid);
  if (!user) redirect("/admin/login");
  return user;
}
