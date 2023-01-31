import { createBot } from "discordeno"

const token = Deno.env.get("DiscordToken")
if (token === undefined) throw new Error("Missing Token")

const bot = createBot({ token })

const emojis = Object.fromEntries(new Map(
	(await bot.helpers.getEmojis(Deno.env.get("TestGuild") ?? ""))
		.map(e => [e.name ?? "", e.id?.toString()]),
))

// IntelliSense

Deno.writeTextFileSync(new URL("./emojis.json", import.meta.url), JSON.stringify(emojis, null, "\t"))

import emojisJson from "./emojis.json" assert { type: "json" }

export { emojisJson as emojis }
export const shorthand = (name: keyof typeof emojisJson) => `<:${name}:${emojis[name]}>`
