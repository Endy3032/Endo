import { Temporal } from "@js-temporal/polyfill"
import googtrans from "@vitalets/google-translate-api"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction,
	ChatInputCommandInteraction, ComponentType, SelectMenuInteraction } from "discord.js"
import { existsSync, readFileSync, writeFile, writeFileSync } from "fs"
import Fuse from "fuse.js"
import { getLyrics } from "genius-lyrics-api"
import wikipedia from "wikipedia"
import { capitalize, colors, emojis, handleError, pickArray, TimeMetric } from "../Modules"

export const cmd = {
	name: "fetch",
	description: "Fetches data from a source on the internet",
	type: ApplicationCommandType.ChatInput,
	options: [
		// #region crypto
		// {
		//   name: "crypto",
		//   description: "Gather details about cryptocurrencies",
		//   type: ApplicationCommandType.SubcommandGroup,
		//   options: [
		//     {
		//       name: "nomics",
		//       description: "Get data from Nomics",
		//       type: ApplicationCommandType.Subcommand,
		//       options: [
		//         {
		//           name: "currency",
		//           description: "The currency to get data for",
		//           type: ApplicationCommandType.String,
		//           autocomplete: true,
		//           required: true,
		//         }
		//       ]
		//     },
		//     {
		//       name: "coinmarketcap",
		//       description: "Get data from CoinMarketCap",
		//       type: ApplicationCommandType.Subcommand,
		//       options: [
		//         {
		//           name: "currency",
		//           description: "The currency to get data for",
		//           type: ApplicationCommandType.String,
		//           autocomplete: true,
		//           required: true,
		//         }
		//       ]
		//     },
		//     {
		//       name: "coingecko",
		//       description: "Get data from CoinGecko",
		//       type: ApplicationCommandType.Subcommand,
		//       options: [
		//         {
		//           name: "currency",
		//           description: "The currency to get data for",
		//           type: ApplicationCommandType.String,
		//           autocomplete: true,
		//           required: true,
		//         }
		//       ]
		//     },
		//   ]
		// },
		// #endregion
		{
			name: "definition",
			description: "Fetch a definition from dictionaries",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "dictionary",
					description: "The dictionary to use",
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: "Dictionary API", value: "dictapi" },
						{ name: "Urban Dictionary", value: "urban" },
					],
					required: true,
				},
				{
					name: "word",
					description: "The word to fetch the definition",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true,
				},
			],
		},
		{
			name: "lyrics",
			description: "Fetch lyrics from Genius",
			type: ApplicationCommandOptionType.Subcommand,
			options: [{
				name: "song",
				description: "The song to search for",
				type: ApplicationCommandOptionType.String,
				autocomplete: true,
				required: true,
			}],
		},
		{
			name: "translation",
			description: "Fetch a translation from Google Translate",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "to",
					description: "The translated language",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true,
				},
				{
					name: "text",
					description: "The text to translate",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "from",
					description: "The source language",
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false,
				},
			],
		},
		{
			name: "weather",
			description: "Fetch the current weather for any places from www.weatherapi.com",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "location",
					description: "The location to fetch the weather data [string]",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
				{
					name: "options",
					description: "Options to change the output",
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: "Use Imperial (˚F)", value: "imp" },
						{ name: "Includes Air Quality", value: "aq" },
						{ name: "Both", value: "both" },
					],
					required: false,
				},
			],
		},
		{
			name: "wikipedia",
			description: "Fetch a Wikipedia article",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "article",
					description: "Search for a Wikipedia article",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "query",
							description: "The query to search for",
							type: ApplicationCommandOptionType.String,
							autocomplete: true,
							required: true,
						},
					],
				},
			],
		},
	],
}

export async function main(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply()
	switch (interaction.options.getSubcommandGroup()) {
		case "wikipedia": {
			switch (interaction.options.getSubcommand()) {
				case "article": {
					const article = interaction.options.getString("query", true)
					await wikipedia.page(article)
						.then(async page => {
							const summary = await page.summary()
							const { pages: related } = await page.related()

							interaction.editReply({ components: [{
								type: ComponentType.ActionRow,
								components: [{
									type: ComponentType.SelectMenu,
									placeholder: "Related Articles (doesnt work yet)",
									custom_id: "wikipedia-related",
									options: [...related.map(page => {
										return { label: page.title.replaceAll("_", " ").slice(0, 100), value: page.pageid.toString().slice(0, 100),
											description: page.description.slice(0, 100) }
									})].slice(0, 25),
								}],
							}], embeds: [{
								title: summary.title.replaceAll("_", " "),
								url: page.fullurl,
								description: `**\`\`\`${summary.description}\`\`\`**\n${summary.extract}`,
								color: pickArray(colors),
								thumbnail: { url: summary.thumbnail.source },
							}] })
						})
						.catch(() => {
							return interaction.editReply(`No Wikipedia article found for ${article}`)
						})
					break
				}
			}
			break
		}

		default: {
			switch (interaction.options.getSubcommand()) {
				case "lyrics": {
					const id = interaction.options.getString("song")
					const request: AxiosRequestConfig = {
						method: "GET",
						url: `https://api.genius.com/songs/${id}`,
						params: { access_token: process.env.GeniusClientAccess },
					}

					const lyrics = await getLyrics(`https://genius.com/songs/${id}`)
						.catch(() => {
							return interaction.editReply(`The song ${id} was not found. Select one from the list next time.`)
						})

					await axios.request(request)
						.then((response: AxiosResponse) => {
							const { song: data } = response.data.response
							let title: string
							const [year, month, day] = data.release_date.split("-")

							interaction.editReply({ embeds: [{
								title: (title = `${data.title} - ${data.artist_names}`).length > 100 ? title.slice(0, 99) + "…" : title,
								color: pickArray(colors),
								description: lyrics || "No lyrics",
								thumbnail: { url: data.song_art_image_url },
								footer: { text: `Source • Genius | Album • ${data.album?.name || "None"} | Release Date` },
								timestamp: Temporal.ZonedDateTime.from({ year, month, day, timeZone: "UTC" }).toString({ timeZoneName: "never" }),
							}] })
						})

					break
				}

				case "translation": {
					const [src, dst, txt] = [interaction.options.getString("from") || "auto", interaction.options.getString("to"),
						interaction.options.getString("text")] as string[]
					googtrans(txt, { from: src, to: dst })
						.then(result => {
							interaction.editReply({ embeds: [{
								title: "Translation",
								color: pickArray(colors),
								fields: [
									{ name: `From ${googtrans.languages[result.from.language.iso]}`, value: `${txt}` },
									{ name: `To ${googtrans.languages[dst]}`, value: `${result.text}` },
								],
							}] })
						})
						.catch((err: Error) => {
							return handleError(interaction, err, "Translation")
						})

					break
				}

				case "weather": {
					const location = interaction.options.getString("location")
					const options = interaction.options.getString("options")
					const [unit, dist, symbol, speed] = ["imp", "both"].includes(options as string)
						? ["imperial", "mi", "˚F", "mi/h"]
						: ["metric", "km", "˚C", "m/s"]
					const isMetric = unit == "metric"

					await axios.get(encodeURI("https://api.weatherapi.com/v1/forecast.json"), {
						params: { key: process.env.WeatherAPI, q: location, days: 1, aqi: "yes" },
					})
						.then((response: AxiosResponse) => {
							const { data } = response
							const { location: locData } = data
							const now = Temporal.Now.instant()

							data.localTime = Temporal.Instant.fromEpochSeconds(locData.localtime_epoch)
							data.deviceTime = Temporal.Instant.fromEpochSeconds(now.epochSeconds - now.toZonedDateTimeISO("UTC").second)
							data.tz = Temporal.TimeZone.from(locData.tz_id).getOffsetNanosecondsFor(data.localTime) / TimeMetric.nano2hour
							data.title = `${locData.name}${locData.region == "" ? "" : ` - ${locData.region}`} - ${locData.country} (UTC${
								data.tz != 0 ? ` ${data.tz > 0 ? "+" : ""}${data.tz}` : ""
							})`

							const base = Temporal.Instant.fromEpochSeconds(data.forecast.forecastday[0].date_epoch)
							const discordTs: number[] = []
							const aqiRatings = [[null, "Good", "Moderate", "Unhealthy for Sensitive Group", "Unhealthy", "Very Unhealthy",
								"Hazardous"], [null, "Low", "Moderate", "High", "Very High"]]
							const times = [data.forecast.forecastday[0].astro.sunrise, data.forecast.forecastday[0].astro.sunset,
								data.forecast.forecastday[0].astro.moonrise, data.forecast.forecastday[0].astro.moonset]

							discordTs.push(...times.map((time: string, ind: number) => {
								var hr = parseInt(time.slice(0, 2)) - data.tz
								if (time.endsWith("PM")) hr += 12
								const mn = parseInt(time.slice(3, 5))
								if (time.startsWith("0")) times[ind] = time.slice(1)

								return Temporal.Instant.fromEpochSeconds(base.epochSeconds + hr * TimeMetric.sec2hour + mn * TimeMetric.sec2min)
									.epochSeconds
							}))

							const weatherEmbed = {
								title: data.title,
								color: pickArray(colors),
								description: `Data Provided by ${
									shorthand("WeatherAPI")
								} [WeatherAPI](https://www.weatherapi.com/)\`\`\`Weather • ${data.current.condition.text}\`\`\``,
								fields: [
									{ name: "Temperature   ", value: `${isMetric ? data.current.temp_c : data.current.temp_f}${symbol}`, inline: true },
									{ name: "Feels Like   ", value: `${isMetric ? data.current.feelslike_c : data.current.feelslike_f}${symbol}`,
										inline: true },
									{ name: "Min/Max Temp",
										value: `${isMetric ? data.forecast.forecastday[0].day.mintemp_c : data.forecast.forecastday[0].day.mintemp_f}/${
											isMetric ? data.forecast.forecastday[0].day.maxtemp_c : data.forecase.forecaseday[0].day.maxtemp_f
										}${symbol}`, inline: true },
									{ name: "Pressure", value: isMetric ? `${data.current.pressure_mb}hPa` : `${data.current.pressure_in}in`,
										inline: true },
									{ name: "Humidity", value: `${data.current.humidity}%`, inline: true },
									{ name: "Clouds", value: `${data.current.cloud}%`, inline: true },
									{ name: "Wind",
										value: `${
											isMetric ? data.current.wind_kph : data.current.wind_mph
										}${speed} ${data.current.wind_degree}˚ ${data.current.wind_dir}`, inline: true },
									{ name: "Gust", value: `${isMetric ? data.current.gust_kph : data.current.gust_mph}${speed}`, inline: true },
									{ name: "Visibility", value: `${isMetric ? data.current.vis_km : data.current.vis_miles}${dist}`, inline: true },
									{ name: "Sunrise", value: `${times[0]}\n(<t:${discordTs[0]}:t> Here)`, inline: true },
									{ name: "Sunset", value: `${times[1]}\n(<t:${discordTs[1]}:t> Here)`, inline: true },
									{ name: "UV Index", value: `${data.current.uv}`, inline: true },
									{ name: "Moonrise", value: `${times[2]}\n(<t:${discordTs[2]}:t> Here)`, inline: true },
									{ name: "Moonset", value: `${times[3]}\n(<t:${discordTs[3]}:t> Here)`, inline: true },
									{ name: "Moon Phase",
										value: `${data.forecast.forecastday[0].astro.moon_phase}\n${
											data.forecast.forecastday[0].astro.moon_illumination
										}% Illuminated`, inline: true },
								],
								thumbnail: { url: `https:${data.current.condition.icon}` },
								timestamp: Temporal.Now.instant().toString(),
							}

							if (["aq", "both"].includes(options as string)) {
								weatherEmbed.fields.push(
									{ name: "\u200b",
										value: `\`\`\`Air Quality\nUS - EPA Rating • ${
											aqiRatings[0][data.current.air_quality["us-epa-index"]]
										}\nUK Defra Rating • ${aqiRatings[1][Math.ceil(data.current.air_quality["gb-defra-index"] / 3)]} Risk\`\`\``,
										inline: false },
									{ name: "CO", value: `${data.current.air_quality.co.toFixed(1)} μg/m³`, inline: true },
									{ name: "O₃", value: `${data.current.air_quality.o3.toFixed(1)} μg/m³`, inline: true },
									{ name: "NO₂", value: `${data.current.air_quality.no2.toFixed(1)} μg/m³`, inline: true },
									{ name: "SO₂", value: `${data.current.air_quality.so2.toFixed(1)} μg/m³`, inline: true },
									{ name: "PM 2.5", value: `${data.current.air_quality.pm2_5.toFixed(1)} μg/m³`, inline: true },
									{ name: "PM 10", value: `${data.current.air_quality.pm10.toFixed(1)} μg/m³`, inline: true },
								)
							}

							interaction.editReply({ embeds: [weatherEmbed] })
						})
						.catch((err: AxiosError) => {
							if (err.response?.data.error.code == 1006) {
								return interaction.editReply({
									content: `The location \`${err.config.params.q}\` was not found. Maybe check your spelling?`,
								})
							}
							handleError(interaction, err, "Weather")
						})
					break
				}
			}
			break
		}
	}
}

export async function selectMenu(interaction: SelectMenuInteraction) {
	if (interaction.customId == "wikipedia-related") {
		await interaction.deferUpdate()
		const [articleId] = interaction.values
		await wikipedia.page(articleId)
			.then(async page => {
				const summary = await page.summary()
				const { pages: related } = await page.related()

				interaction.editReply({ components: [{
					type: ComponentType.ActionRow,
					components: [{
						type: ComponentType.SelectMenu,
						placeholder: "Related Articles (doesnt work yet)",
						custom_id: "wikipedia-related",
						options: [...related.map(page => {
							return { label: page.title.replaceAll("_", " ").slice(0, 100), value: page.pageid.toString().slice(0, 100),
								description: page.description.slice(0, 100) }
						})].slice(0, 25),
					}],
				}], embeds: [{
					title: summary.title.replaceAll("_", " "),
					url: page.fullurl,
					description: `**\`\`\`${summary.description}\`\`\`**\n${summary.extract}`,
					color: pickArray(colors),
					thumbnail: { url: summary.thumbnail.source },
				}] })
			})
			.catch((err: Error) => {
				return handleError(interaction, err, "Wikipedia")
			})
	}
}

export async function autocomplete(interaction: AutocompleteInteraction) {
	const current = interaction.options.getFocused() as string
	const blankInitial = { name: "Keep typing to continue…", value: "__" }
	const initial = { name: current || "Keep typing to continue…", value: current || "__" }
	let response: ApplicationCommandOptionChoice[] = []

	switch (interaction.options.getSubcommandGroup()) {
		case "wikipedia": {
			if (current.length == 0) return interaction.respond([initial])
			const choices: ApplicationCommandOptionChoice[] = (await wikipedia.search(current, { limit: 20 })).results.map(result => {
				return { name: result.title, value: `${result.pageid}` }
			})
			const fuse = new Fuse(choices, { distance: 20, keys: ["name", "value"] })
			response.push(...fuse.search(current as string).map(option => option.item))
			response.push(...choices.filter((option: ApplicationCommandOptionChoice) => !response.includes(option)))
			if (!interaction.responded) interaction.respond(response.slice(0, 20))
			break
		}

		default: {
			switch (interaction.options.getSubcommand()) {
				case "lyrics": {
					if (current.length == 0) return interaction.respond([initial])

					const options: ApplicationCommandOptionChoice[] = []
					await axios.get("https://api.genius.com/search", { params: { access_token: process.env.GeniusClientAccess, q: current } })
						.then((response: AxiosResponse) => {
							options.push(...response.data.response.hits.map((hit: { result: { title: any; artist_names: any; id: any } }) => {
								let optName: string
								return {
									name: (optName = `${hit.result.title} - ${hit.result.artist_names}`).length > 100
										? optName.slice(0, 99) + "…"
										: optName,
									value: `${hit.result.id}`,
								}
							}))
						})

					const fuse = new Fuse(options, { distance: options.length, keys: ["name", "value"] })
					response = [...fuse.search(current).map(option => option.item)]
					response.push(...options.filter((option: ApplicationCommandOptionChoice) => !response.includes(option)))
					if (!interaction.responded) interaction.respond(response.slice(0, 25))
					break
				}

				case "translation": {
					const { languages } = googtrans
					const languageList = Object.entries(languages).map(([k, v]) => {
						return { name: v, value: k }
					}).slice(0, -2) as ApplicationCommandOptionChoice[]

					const current = interaction.options.getFocused(true) as ApplicationCommandOptionChoice
					response = current.name == "from" ? [languageList[0]] : []
					const fuse = new Fuse(languageList.slice(1), { distance: 25, keys: ["name", "value"] })
					response.push(...fuse.search(current.value as string).map(option => option.item))
					response.push(...languageList.slice(1).filter((option: ApplicationCommandOptionChoice) => !response.includes(option)))
					if (!interaction.responded) interaction.respond(response.slice(0, 25))
					break
				}

				case "weather": {
					if (current.length == 0) return interaction.respond([blankInitial])

					await axios.get(encodeURI("https://api.weatherapi.com/v1/search.json"), {
						params: { key: process.env.WeatherAPI, q: current },
					})
						.then((res: AxiosResponse) => {
							if (res.data.length == 0) return interaction.respond([blankInitial])
							const data: ApplicationCommandOptionChoice[] = res.data.map(
								(option: { id: number; name: string; region: string; country: string; lat: number; lon: number; url: string }) => {
									return { name: `${option.name}, ${option.country}`, value: `${option.name},${option.country}`.slice(0, 100) }
								},
							)

							const fuse = new Fuse(data, { distance: data.length, keys: ["name", "value"] })
							response = [...fuse.search(current).map(option => option.item)]
							response.push(...data.filter((option: ApplicationCommandOptionChoice) => !response.includes(option)))
							if (!interaction.responded) interaction.respond(response.slice(0, 25))
						})
					break
				}
			}
			break
		}
	}
}
