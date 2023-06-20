import bot from "bot"

const emojis = Object.fromEntries(new Map(
	(await bot.rest.getEmojis(Deno.env.get("TestGuild") ?? ""))
		.map(e => [e.name ?? "", { id: e.id!.toString(), animated: e.animated ?? false }]),
))

// IntelliSense
Deno.writeTextFileSync(new URL("./emojis.json", import.meta.url), JSON.stringify(emojis, null, "\t"))

import emojisJson from "./emojis.json" assert { type: "json" }

export { emojisJson as emojis }
export const shorthand = (name: keyof typeof emojisJson) => `<${emojis[name].animated ? "a" : ""}:${name}:${emojis[name].id}>`
