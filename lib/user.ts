import getDb from "./kysely";

const db = getDb();

export default async function getUser(telegramId: string) {
  const user = await db
    .selectFrom("users")
    .select(["first_name", "telegram_id"])
    .where("telegram_id", "=", telegramId)
    .executeTakeFirst();
  return user;
}
