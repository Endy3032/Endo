import { EventHandlers } from "discordeno"
import { getFiles } from "modules"

const eventHandlers = {}

for await (const file of getFiles("events")) {
	const { name, main } = await import(`./${file}`)
	eventHandlers[name as keyof EventHandlers] = main
}

export default eventHandlers
