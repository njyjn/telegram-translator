import { createKysely } from "@vercel/postgres-kysely";
import { Generated, ColumnType, sql } from "kysely";

interface UserTable {
  id: Generated<number>;
  federation_id: string | null;
  telegram_id: string | null;
  first_name: string;
  last_name: string | null;
  modified_at: ColumnType<Date, string | undefined, never>;
}

interface CarLocationLogTable {
  id: Generated<number>;
  user_id: number;
  license_plate: string;
  location: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

interface Database {
  users: UserTable;
  carLocationLogs: CarLocationLogTable;
}

export default function getDb() {
  return createKysely<Database>();
}

export async function seedDb() {
  const db = getDb();

  console.info(`Seeding tables...`);

  const createUsersTable = await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("federation_id", "varchar(255)")
    .addColumn("telegram_id", "varchar(255)")
    .addColumn("first_name", "varchar(255)", (cb) => cb.notNull())
    .addColumn("last_name", "varchar(255)")
    .addColumn("modified_at", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`),
    )
    .execute();

  const createCarLocationLogsTable = await db.schema
    .createTable("carLocationLogs")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("user_id", "integer", (cb) => cb.notNull())
    .addColumn("license_plate", "varchar(255)", (cb) => cb.notNull())
    .addColumn("location", "varchar(255)", (cb) => cb.notNull())
    .addColumn("created_at", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`),
    )
    .addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"], (cb) =>
      cb.onDelete("cascade"),
    )
    .execute();

  return {
    createUsersTable,
    createCarLocationLogsTable,
  };
}
