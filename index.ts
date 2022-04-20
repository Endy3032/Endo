import { configSync as dotenv } from "https://deno.land/std@0.135.0/dotenv/mod.ts"
import { createBot, startBot } from "https://deno.land/x/discordeno@13.0.0-rc35/mod.ts"

dotenv({ export: true })
const env = Deno.env.toObject()

const bot = createBot({
  token: env.DiscordToken,
  botId: BigInt(env.Client),
  intents: ["Guilds", "DirectMessages"],
  events: {
    ready: async () => console.log("Ready")
  },
})

// deploy(bot, Deno.args)

startBot(bot)