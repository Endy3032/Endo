import { EventHandlers } from "discordeno"
import { InspectConfig } from "modules"

export const name: keyof EventHandlers = "debug"

export const main: EventHandlers["debug"] = (text: string, ...args: any[]) => {
	const tag = text.match(/(?<=\[)\S.*?(?=\])/)?.[0]
	let content = text.match(/(?<=(^\[\S.*?] )).*/)?.[0] ?? text

	if (tag?.includes("RequestCreate")) {
		const json = content?.match(/(?<=( \| Body: )).*/)?.[0] ?? ""
		content = content?.replace(" | Body: " + json, "\n") + Deno.inspect(JSON.parse(json != "undefined" ? json : "{}"), InspectConfig)
	} else if (tag?.includes("FetchSuccess")) {
		const matched = content?.match(/(?<=^(URL: .*? \| )).*/)?.[0] ?? ""
		content = content?.replace(" | " + matched, "\n")

		const json = JSON.parse(matched)
		if (json.payload?.body) {
			try {
				json.payload.body = JSON.parse(json.payload.body)
			} catch {}
		}
		content += Deno.inspect(json, InspectConfig)
	} else if (tag?.includes("fetchSuccess") || tag?.includes("Add To Global Queue")) {
		const json = JSON.parse(content ?? "\n")
		if (json.payload?.body) {
			try {
				json.payload.body = JSON.parse(json.payload.body)
			} catch {}
		}
		content = Deno.inspect(json, InspectConfig)
	}

	if (args.length > 0) console.log(args)
	console.botLog(content, { noSend: true, logLevel: "DEBUG", tag })
}
