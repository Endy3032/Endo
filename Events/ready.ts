import { Bot, EventHandlers, User } from "discordeno"

type Payload = {
  shardId: number;
  v: number;
  user: User;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
}

export const name: keyof EventHandlers = "ready"
export const execute: EventHandlers["ready"] = (bot: Bot, payload: Payload) => {
  console.tagLog("Login", `As ${payload.user.username}#${payload.user.discriminator} [${bot.botGatewayData?.sessionStartLimit.remaining} Remaining]`)
}