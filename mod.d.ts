import { BotLog } from "modules"

declare global {
	interface Console {
		botLog: BotLog
	}
}
