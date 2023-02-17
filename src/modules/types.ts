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

export enum Nord {
	red = 0xBF616A,
	yellow = 0xEBCB8B,
	green = 0xA3BE8C,
	blue = 0x81A1C1,

	brightOrange = 0xE09780,
	brightYellow = 0xFBDB9B,
	brightGreen = 0xB3CE9C,
	brightCyan = 0x98D0E0,
	brightBlue = 0x91B1D1,

	info = 0xA3BE8C,
	warn = 0xEBCB8B,
	error = 0xBF616A,
	debug = 0xD08770,
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
