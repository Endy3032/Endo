import { BotLog } from "modules"

declare global {
	interface Console {
		botLog: BotLog
	}

	interface Window {
		createElement: typeof createElement
		Fragment: typeof Fragment
	}
}
