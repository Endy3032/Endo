import { LogOptions } from "modules"

declare global {
	interface Console {
		botLog: (content: any, options?: LogOptions) => Promise<void>
	}
}
