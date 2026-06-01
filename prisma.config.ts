// Prisma config for Render PostgreSQL
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Load environment variables explicitly
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("[v0] DATABASE_URL not set in environment variables");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl || "",
  },
});
