import { deploy } from "./Modules/index.ts"
import {
  configSync as dotenv, // dotenv
  createBot, startBot, // discordeno
} from "./deps.ts"

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

deploy(bot, Deno.args)

startBot(bot)