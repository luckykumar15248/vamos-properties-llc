import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

type Database = ReturnType<typeof postgres<Contract>>;

let database: Database | undefined;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!database) {
    database = postgres<Contract>({
      contractJson,
      url,
      poolOptions: {
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 5_000,
      },
    });
  }
  return database;
}
