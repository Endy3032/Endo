import { ActivityTypes, BotStatusUpdate } from "discordeno"
import { pickArray } from "./utils.ts"

type Activity = { [key in Exclude<keyof typeof ActivityTypes, "Custom" | "Competing" | "Streaming">]: string[] }
type StreamingActivity = { Streaming: { [key: string]: string[] } }

const status: Activity & StreamingActivity = {
	Game: ["Deno", "Replit", "VSCode", "Discordeno"],
	Listening: ["/help", "🌧agoraphobic🌧", "llusion - jealous"],
	Watching: ["Stranger Things", "Thinger Strangs", "Stringer Thangs", "Thanger Strings"],
	Streaming: {
		lofi: [
			"dQw4w9WgXcQ",
			"9FIkzOrryf8",
			"jfKfPfyJRdk",
			"MVPTGNGiI-4",
			"rUxyKA_-grg",
			"TsTtqGAxvWk",
			"CIfGUiICf8U",
		],
	},
}

export function activities(): BotStatusUpdate {
	const type = pickArray(Object.keys(status)) as keyof typeof status
	const name = pickArray(type == "Streaming" ? Object.keys(status.Streaming) : status[type])
	const url = type === "Streaming" ? `https://youtube.com/watch?v=${pickArray(status.Streaming[name])}` : undefined

	return {
		since: null,
		activities: [{
			name,
			url,
			type: ActivityTypes[type],
		}],
		status: "idle",
	}
}
