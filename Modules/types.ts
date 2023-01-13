import { Bot, CreateApplicationCommand, CreateMessage, Embed, Interaction } from "discordeno"

export type InteractionHandler = (bot: Bot, interaction: Interaction) => Promise<void>

export type CommandHandler = {
	main: InteractionHandler
	button?: InteractionHandler
	select?: InteractionHandler
	modal?: InteractionHandler
	autocomplete?: InteractionHandler
}

export type Command = CommandHandler & { cmd: CreateApplicationCommand }

export type LogLevel =
	| "INFO"
	| "WARN"
	| "ERROR"
	| "DEBUG"

export interface LogOptions {
	logLevel?: LogLevel
	tag?: string
	embed?: Embed
	noSend?: boolean
	message?: CreateMessage
}

export type BotLog = (content: any, options?: LogOptions) => Promise<void>

export enum Nord {
	// Polar Night
	night1 = 0x2E3440,
	night2 = 0x3B4252,
	night3 = 0x434C5E,
	night4 = 0x4C566A,

	// Snow Storm
	storm1 = 0xD8DEE9,
	storm2 = 0xE5E9F0,
	storm3 = 0xECEFF4,

	// Frost
	frost1 = 0x8FBCBB,
	frost2 = 0x88C0D0,
	frost3 = 0x81A1C1,
	frost4 = 0x5E81AC,

	// Aurora + Default Colors
	red = 0xBF616A,
	orange = 0xD08770,
	yellow = 0xEBCB8B,
	green = 0xA3BE8C,
	cyan = 0x88C0D0,
	blue = 0x81A1C1,
	magenta = 0xB48EAD,
	black = 0x2E3440,
	white = 0xECEFF4,
	info = 0xA3BE8C,
	warn = 0xEBCB8B,
	error = 0xBF616A,
	debug = 0xD08770,
}

export enum BrightNord {
	// Polar Night
	night1 = 0x3E4450,
	night2 = 0x4B5262,
	night3 = 0x535C6E,
	night4 = 0x5C667A,

	// Snow Storm
	storm1 = 0xE8EEF9,
	storm2 = 0xF5F9F0,
	storm3 = 0xFCFFF4,

	// Frost
	frost1 = 0x9FCCCB,
	frost2 = 0x98D0E0,
	frost3 = 0x91B1D1,
	frost4 = 0x6E91BC,

	// Aurora + Default Colors
	red = 0xCF717A,
	orange = 0xE09780,
	yellow = 0xFBDB9B,
	green = 0xB3CE9C,
	cyan = 0x98D0E0,
	blue = 0x91B1D1,
	magenta = 0xC49EBD,
	black = 0x3E4450,
	white = 0xFCFFF4,
	info = 0xB3CE9C,
	warn = 0xFBDB9B,
	error = 0xCF717A,
	debug = 0xE09780,
}

export enum DarkNord {
	// Polar Night
	night1 = 0x1E2430,
	night2 = 0x2B3242,
	night3 = 0x333C4E,
	night4 = 0x3C465A,

	// Snow Storm
	storm1 = 0xC8CED9,
	storm2 = 0xD5D9E0,
	storm3 = 0xDCDFE4,

	// Frost
	frost1 = 0x7FACAB,
	frost2 = 0x78B0C0,
	frost3 = 0x7191B1,
	frost4 = 0x5E719C,

	// Aurora + Default Colors
	red = 0xAF515A,
	orange = 0xC07760,
	yellow = 0xCBBB7B,
	green = 0x93AE7C,
	cyan = 0x78B0C0,
	blue = 0x7191B1,
	magenta = 0xA47E9D,
	black = 0x1E2430,
	white = 0xDCDFE4,
	info = 0x93AE7C,
	warn = 0xCBBB7B,
	error = 0xAF515A,
	debug = 0xC07760,
}

export enum TimeMetric {
	nano_micro = 1000,
	nano_milli = 1000000,
	nano_sec = 1000000000,
	nano_min = 60000000000,
	nano_hour = 3600000000000,
	nano_day = 86400000000000,
	nano_week = 604800000000000,
	nano_year = 3154000000000000,

	micro_nano = 0.0001,
	micro_milli = 1000,
	micro_sec = 1000000,
	micro_min = 60000000,
	micro_hour = 3600000000,
	micro_day = 8640000000,
	micro_week = 60480000000,
	micro_year = 31540000000,

	milli_nano = 0.000001,
	milli_micro = 0.001,
	milli_sec = 1000,
	milli_min = 60000,
	milli_hour = 3600000,
	milli_day = 86400000,
	milli_week = 604800000,
	milli_year = 3153600000,

	sec_nano = 0.000000001,
	sec_micro = 0.000001,
	sec_milli = 0.001,
	sec_min = 60,
	sec_hour = 3600,
	sec_day = 86400,
	sec_week = 604800,
	sec_year = 31536000,
}

export enum MessageFlags {
	Crossposted = 1 << 0, // this message has been published to subscribed channels (via Channel Following)
	IsCrosspost = 1 << 1, // this message originated from a message in another channel (via Channel Following)
	SuppressEmbeds = 1 << 2, // do not include any embeds when serializing this message
	SourceMessageDeleted = 1 << 3, // the source message for this crosspost has been deleted (via Channel Following)
	Urgent = 1 << 4, // this message came from the urgent message system
	HasThread = 1 << 5, // this message has an associated thread, with the same id as the message
	Ephemeral = 1 << 6, // this message is only visible to the user who invoked the Interaction
	Loading = 1 << 7, // this message is an Interaction Response and the bot is "thinking"
	FailedToMentionSomeRolesInThread = 1 << 8, // this message failed to mention some roles and add their members to the thread
}
