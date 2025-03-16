import { Context, MiddlewareFn } from "telegraf";
import getUser from "../user";

export const authMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const user = await getUser(ctx.from!.id.toString());
  if (user) {
    console.info(
      `Registered user ${user.first_name} (${user.telegram_id}) engaging...`,
    );
    return next();
  }

  console.info(`User ${ctx.from!.id.toString()} attempted to engage...`);
};
