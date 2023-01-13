import { ActivityTypes, StatusUpdate } from "discordeno"
import { Temporal } from "temporal"
import { pickArray } from "./random.ts"

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
			"5qap5aO4i9A",
			"DWcJFNfaw9c",
			"TsTtqGAxvWk",
			"CIfGUiICf8U",
		],
	},
}

export function activities(): StatusUpdate {
	const type = pickArray(Object.keys(status))
	const name = pickArray(type == "Streaming" ? Object.keys(status.Streaming) : status[type])
	const url = type === "Streaming" ? `https://youtube.com/watch?v=${pickArray(status.Streaming[name])}` : undefined

	return {
		activities: [{
			name,
			url,
			type: parseInt(ActivityTypes[type]),
			createdAt: Temporal.Now.instant().epochMilliseconds,
		}],
		status: "idle",
	}
}
