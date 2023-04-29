import type { CreateElement } from "jsx"
import type { BotLog } from "log"

declare global {
	interface Console {
		botLog: BotLog
	}

	interface Window {
		createElement: CreateElement
	}
}
