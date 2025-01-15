import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./*.sql.ts"],
  out: "./migrations",
  dbCredentials: {
    host: Resource.Postgres.host,
    port: Resource.Postgres.port,
    user: Resource.Postgres.username,
    password: Resource.Postgres.password,
    database: Resource.Postgres.database,
  },
});
