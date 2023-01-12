import { createBot } from "discordeno"

const token = Deno.env.get("DiscordToken")
if (token === undefined) throw new Error("Missing Token")
const bot = createBot({ token })

const emojiss = (await bot.helpers.getEmojis(Deno.env.get("TestGuild") ?? "")).array()
	.reduce((map, e) => {
		// map[e.name ?? ""] = { name: e.name, id: e.id?.toString(), shorthand: `<:${e.name}:${e.id}>` }
		map[e.name ?? ""] = e.id?.toString()
		return map
	}, {})

await Deno.writeTextFile(new URL("./emojis.json", import.meta.url), JSON.stringify(emojiss, null, 2))

import emojisJson from "./emojis.json" assert { type: "json" }
export const emojis = emojisJson

type emojiName = keyof typeof emojis
export const shorthand = (name: emojiName) => `<:${name}:${emojis[name]}>`
