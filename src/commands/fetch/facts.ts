import axiod from "axiod"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { capitalize, colors, defer, getSubcmd, getValue, pickArray, respond } from "modules"
import { Temporal } from "temporal"

export const cmd: ApplicationCommandOption = {
	name: "facts",
	description: "Get a fact from le internet",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "cat",
			description: "Get a random cat fact",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "date",
			description: "Get a fact about a date",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "day",
					description: "The date's day",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 1,
					maxValue: 31,
					required: true,
				},
				{
					name: "month",
					description: "The date's month",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 1,
					maxValue: 12,
					required: true,
				},
			],
		},
		{
			name: "legacy",
			description: "Get a random fact from the legacy list",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "trivia",
			description: "Get a random trivia fact from API Ninjas",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "number",
			description: "Get a fact about a number",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "mode",
					description: "The fact's mode",
					type: ApplicationCommandOptionTypes.String,
					choices: [
						{ name: "Trivia", value: "trivia" },
						{ name: "Math", value: "math" },
						{ name: "Year", value: "year" },
					],
					required: true,
				},
				{
					name: "number",
					description: "The fact's number",
					type: ApplicationCommandOptionTypes.Integer,
					required: true,
				},
			],
		},
		{
			name: "random",
			description: "Get a random fact",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "useless",
			description: "Get a random useless fact",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)
	let fact: string | string[] = "Wow, such empty",
		source: string | undefined = undefined,
		url: string | undefined = undefined,
		iconUrl: string | undefined = undefined

	switch (getSubcmd(interaction)) {
		case "cat": {
			try {
				fact = JSON.parse(Deno.readTextFileSync("./assets/cat-facts.json"))
			} catch {
				const { data } = await axiod.get("https://raw.githubusercontent.com/vadimdemedes/cat-facts/master/cat-facts.json")
				fact = data
				Deno.writeTextFileSync("./assets/cat-facts.json", JSON.stringify(fact, null, 2))
			}

			;[source, url] = ["vadimdemedes", "https://github.com/vadimdemedes/cat-facts"]
			break
		}

		case "date": {
			const day = getValue(interaction, "day", "Integer") ?? 1
			const month = getValue(interaction, "month", "Integer") ?? 1
			const date = Temporal.ZonedDateTime.from({ year: 2020, month, day, timeZone: "UTC" })
			const { data } = await axiod.get(`http://numbersapi.com/${date.month}/${date.day}/date`)
			;[fact, source, url, iconUrl] = [data, "Numbers API", "http://numbersapi.com/", "http://numbersapi.com/img/favicon.ico"]
			break
		}

		case "legacy": {
			fact = [
				"The chicken came first or the egg? The answer is... `the chicken`",
				"The alphabet is completely random",
				"I ran out of facts. That's a fact",
				"Found this fact? You're lucky!",
				"There are 168 prime numbers between 1 and 1000",
				"`τ` is just `π` times two!",
				"`τ` is `tau` and `π` is `pi`!",
				"The F word is the most flexible word in English!",
				"`Homosapiens` are how biologists call humans!",
				"`Endy` is a cool bot! And that's a fact!",
				"`Long` is short and `short` is long!",
				"√-1 love you!",
				"There are 13 Slavic countries in the world -- Brought to you by your gopnik friend!",
				"There are plagues in 1620, 1720, 1820, 1920 and...",
				"The phrase: `The quick brown fox jumps over the lazy dog` contains every letter in the alphabet!",
				"There are no Nobel prizes for math because Nobel lost his love to a mathematician",
				"Endy is intellegent",
				"69 is just a normal number ok?",
				"There are 24 synthetic elements from 95~118",
				"Most of these facts are written by Adnagaporp#1965",
			]
			break
		}

		case "number": {
			const mode = getValue(interaction, "mode", "String") ?? "trivia"
			const number = getValue(interaction, "number", "Integer") ?? 1
			const { data } = await axiod.get(`http://numbersapi.com/${number}/${mode}`)
			;[fact, source, url, iconUrl] = [data, "Numbers API", "http://numbersapi.com/", "http://numbersapi.com/img/favicon.ico"]
			break
		}

		case "trivia": {
			const { data } = await axiod.get("https://facts-by-api-ninjas.p.rapidapi.com/v1/facts", {
				headers: {
					"X-RapidAPI-Key": Deno.env.get("RapidAPI") ?? "",
					"X-RapidAPI-Host": "facts-by-api-ninjas.p.rapidapi.com",
				},
			})
			;[fact, source, url, iconUrl] = [data[0].fact, "API Ninjas", "https://api-ninjas.com/facts",
				"https://rapidapi-prod-apis.s3.amazonaws.com/0a046a2e-24a5-4309-aa42-f3521e784b30.png"]
			break
		}

		case "useless": {
			switch (pickArray(["pl", "sk"])) {
				case "pl": {
					const { data } = await axiod.get("https://useless-facts.sameerkumar.website/api")
					;[fact, source, url] = [data.data, "sameerkumar18", "https://github.com/sameerkumar18/useless-facts-api"]
					break
				}

				case "sk": {
					const { data } = await axiod.get("https://useless-facts.sameerkumar.website/api")
					;[fact, source, url] = [data.text, `${data.source} via jsph.pl`, "https://useless-facts.sameerkumar.website"]
					break
				}
			}
			break
		}
	}

	await respond(bot, interaction, {
		embeds: [{
			title: `${capitalize(getSubcmd(interaction) ?? "")} Fact`,
			author: source ? { name: `Source: ${source}`, url, iconUrl: iconUrl ?? "https://github.com/fluidicon.png" } : undefined,
			color: pickArray(colors),
			description: typeof fact === "string" ? fact : pickArray(fact),
		}],
	})
}
