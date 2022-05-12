import { EventHandlers } from "discordeno"

export const name: keyof EventHandlers = "ready"
export const execute = (bot: any) => console.log(`${bot.botGatewayData.sessionStartLimit.remaining} Logins remaining`)