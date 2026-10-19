import "server-only";

import { getDb } from "@/src/prisma/db";
import { hashPassword } from "@/lib/admin/password";

export type AdminActor = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function findUserById(id: number): Promise<AdminActor | null> {
  const db = getDb();
  const user = await db.orm.public.User.where({ id }).select("id", "name", "email", "role").first();
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function findUserForLogin(email: string) {
  const db = getDb();
  return db.orm.public.User.where({ email: email.toLowerCase() })
    .select("id", "name", "email", "role", "passwordHash")
    .first();
}

export async function bootstrapAdminIfEmpty() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim();
  if (!email || !name || password.length < 10) return;

  const db = getDb();
  await db.transaction(async (tx) => {
    const existing = await tx.orm.public.User.orderBy((user) => user.id.asc()).first();
    if (existing) return;
    await tx.orm.public.User.create({
      email,
      name,
      role: "owner",
      passwordHash: hashPassword(password),
    });
  });
}
