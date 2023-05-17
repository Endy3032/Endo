import { stripIndents } from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import Fuse from "fuse"
import { getFocused, getSubcmd, getValue, respond } from "modules"
import { Blob } from "node:buffer"
import { join } from "std:path"
import { Temporal } from "temporal"
import { timezone as timezones } from "time"

const timezone = "+00:00"

export const cmd: ApplicationCommandOption = {
	name: "timestamp",
	description: "Get the current timestamp or from a provided date",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "year",
			description: "The timestamp's year [Integer 0~275760]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 0,
			// maxValue: 275760,
			required: false,
		},
		{
			name: "month",
			description: "The timestamp's month [Integer 1~12]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 1,
			maxValue: 12,
			required: false,
		},
		{
			name: "day",
			description: "The timestamp's day [Integer 1~31]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 1,
			maxValue: 31,
			required: false,
		},
		{
			name: "hour",
			description: "The timestamp's hour [Integer 0~23]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 0,
			maxValue: 23,
			required: false,
		},
		{
			name: "minute",
			description: "The timestamp's minute [Integer 0~59]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 0,
			maxValue: 59,
			required: false,
		},
		{
			name: "second",
			description: "The timestamp's second [Integer 0~59]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 0,
			maxValue: 59,
			required: false,
		},
		{
			name: "millisecond",
			description: "The timestamp's millisecond [Integer 0~59]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 0,
			maxValue: 999,
			required: false,
		},
		{
			name: "timezone",
			description: "The timestamp's timezone [String]",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: false,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const now = Temporal.Now.plainDateTimeISO()
	const millisecond = getValue(interaction, "millisecond", "Integer") ?? now.millisecond
	const second = getValue(interaction, "second", "Integer") ?? now.second
	const minute = getValue(interaction, "minute", "Integer") ?? now.minute
	const hour = getValue(interaction, "hour", "Integer") ?? now.hour
	const day = getValue(interaction, "day", "Integer") ?? now.day
	const month = getValue(interaction, "month", "Integer") ?? now.month
	const timeZone = getValue(interaction, "timezone", "String") ?? timezone
	const year = getValue(interaction, "year", "Integer") ?? now.year

	let date: Temporal.ZonedDateTime, invalid = false
	try {
		date = Temporal.ZonedDateTime.from({ year, month, day, hour, minute, second, millisecond, timeZone })
	} catch {
		invalid = true
		date = now.toZonedDateTime(timeZone)
	}

	const finalDate = date.toInstant()

	await respond(bot, interaction, {
		content: stripIndents`${invalid ? "Invalid date. Fallback to current time:" : ""}
		<t:${finalDate.epochSeconds}:F> [GMT ${timeZone.length === 6 ? timeZone : timezones.find(e => e.id === timeZone)?.offset}]
		**Milliseconds** • ${finalDate.epochMilliseconds}
		**Seconds** • ${finalDate.epochSeconds}
		**Styles Table** • Format timestamp with \`<t:Seconds:Style>\``,
		files: [{
			name: "timestamp.png",
			blob: new Blob([await Deno.readFile(join(Deno.cwd(), "assets", "timestamp.png"))]),
		}],
	}, true)
}

const finalTimezones = [
	...[...new Set(timezones.map(e => e.offset))].sort((a: string, b: string) => {
		if (a.startsWith("-") && b.startsWith("-")) return parseInt(a.slice(0, 3)) > parseInt(b.slice(0, 3)) ? 1 : -1
		else if (a.startsWith("-") && !b.startsWith("-")) return -1
		else if (!a.startsWith("-") && b.startsWith("-")) return 1
		return a.localeCompare(b)
	}),
	...timezones.map(e => e.id).filter(e => e.length > 0),
]

export async function autocomplete(bot: Bot, interaction: Interaction) {
	const current = getFocused(interaction, "String") || ""
	const response: ApplicationCommandOptionChoice[] = []

	if (current.length === 0) {
		return await respond(bot, interaction, { choices: finalTimezones.slice(0, 25).map(e => ({ name: e, value: e })) })
	}

	switch (getSubcmd(interaction)) {
		case "timestamp": {
			const fuse = new Fuse(finalTimezones, { distance: 5 })
			response.push(...fuse.search(current).map(res => ({ name: res.item, value: res.item })))
			break
		}
	}

	await respond(bot, interaction, { choices: response.slice(0, 25) })
}
