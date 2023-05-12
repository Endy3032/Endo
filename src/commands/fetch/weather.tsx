import axiod from "axiod"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, DiscordEmbed } from "discordeno"
import Fuse from "fuse"
import { Embed, Field } from "jsx"
import { AutocompleteHandler, defaultChoice, InspectConfig, InteractionHandler, ReadonlyOption, TimeMetric } from "modules"
import { Temporal } from "temporal"

export const cmd = {
	name: "weather",
	description: "Fetch the current weather for any places from www.weatherapi.com",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "location",
			description: "The location to fetch the weather data [string]",
			type: ApplicationCommandOptionTypes.String,
			required: true,
			autocomplete: true,
		},
		{
			name: "options",
			description: "Options to change the output",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Use Imperial (˚F, mi, mi/h)", value: "imp" },
				{ name: "Includes Air Quality", value: "aq" },
				{ name: "Both", value: "both" },
			],
			required: false,
		},
	],
} as const satisfies ReadonlyOption

const WeatherKey = Deno.env.get("Weather"),
	ratings = {
		us: ["Good", "Moderate", "Unhealthy for Sensitive Group", "Unhealthy", "Very Unhealthy", "Hazardous"],
		uk: ["Low", "Moderate", "High", "Very High"],
	},
	units = {
		imp: ["f", "°F", "in", "in", "mph", "mi/h", "miles", "mi", "µg/m³"],
		met: ["c", "°C", "mb", "hPa", "kph", "km/h", "km", "km", "µg/m³"],
	}

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
	if (!WeatherKey) return await interaction.respond("No API Key found", { isPrivate: true })

	await interaction.defer()

	const { location, options } = args
	const [tmp, tmpUnit, prs, prsUnit, spd, spdUnit, dst, dstUnit, aqi] = units[[undefined, "aq"].includes(options) ? "met" : "imp"]

	const { data, data: { location: locationData } } = await axiod.get<Forecast>("https://api.weatherapi.com/v1/forecast.json", {
		params: {
			key: WeatherKey,
			q: location,
			days: 1,
			aqi: "yes",
		},
	})

	const timezone = Temporal.TimeZone.from(locationData.tz_id)
	const localTime = Temporal.Instant.fromEpochSeconds(locationData.localtime_epoch)
	const tzOffset = timezone.getOffsetNanosecondsFor(localTime) / TimeMetric.nano_hour

	const timezoneText = tzOffset ? ` ${tzOffset > 0 ? "+" : ""}${tzOffset}` : ""
	const locationText = [locationData.name, locationData.region, locationData.country].filter(e => e.length).join(", ")
	const { sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination } = data.forecast.forecastday[0].astro

	const timestamps = [sunrise, sunset, moonrise, moonset].map(time => {
		const hr = parseInt(time.slice(0, 2)) + (time.endsWith("PM") ? 12 : 0) - tzOffset
		const mn = parseInt(time.slice(3, 5))

		if (isNaN(hr)) return ""

		return `<t:${data.forecast.forecastday[0].date_epoch + hr * TimeMetric.sec_hour + mn * TimeMetric.sec_min}:t>`
	})

	const weatherData = {
			"🌡️ Temperature": `${data.current[`temp_${tmp}`] + tmpUnit}\nFeels like ${data.current[`temp_${tmp}`] + tmpUnit}`,
			"🔽 Low": data.forecast.forecastday[0].day[`mintemp_${tmp}`] + tmpUnit,
			"🔼 High": data.forecast.forecastday[0].day[`maxtemp_${tmp}`] + tmpUnit,
			"🌀 Pressure": data.current[`pressure_${prs}`] + prsUnit,
			"💧 Humidity": data.current.humidity + "%",
			"☁️ Clouds": data.current.cloud + "%",
			"💨 Wind": `${data.current[`wind_${spd}`] + spdUnit} ${data.current.wind_degree}° ${data.current.wind_dir}`,
			"🍃 Gust": data.current[`gust_${spd}`] + spdUnit,
			"👀 Visibility": data.current[`vis_${dst}`] + dstUnit,
			"🌅 Sunrise": `${sunrise}\n${timestamps[0]}`,
			"🌇 Sunset": `${sunset}\n${timestamps[1]}`,
			"🔆 UV Index": data.current.uv.toString(),
			"🌝 Moonrise": `${moonrise}\n${timestamps[2]}`,
			"🌚 Moonset": `${moonset}\n${timestamps[3]}`,
			"🌙 Moon Phase": `${moon_phase}\n${moon_illumination}% Illuminated`,
		},
		airQualityData = {
			"US - EPA Rating": ratings.us[data.current.air_quality["us-epa-index"] - 1],
			"UK Defra Rating": ratings.uk[Math.floor((data.current.air_quality["gb-defra-index"] - 1) / 3)] + " Risk",
			"\u200b": "\u200b",
			CO: data.current.air_quality.co.toFixed(2) + aqi,
			"NO₂": data.current.air_quality.no2.toFixed(2) + aqi,
			"O₃": data.current.air_quality.o3.toFixed(2) + aqi,
			"SO₂": data.current.air_quality.so2.toFixed(2) + aqi,
			"PM 2.5": data.current.air_quality.pm2_5.toFixed(2) + aqi,
			"PM 10": data.current.air_quality.pm10.toFixed(2) + aqi,
		}

	const embeds: DiscordEmbed[] = [
		(
			<Embed title={`${locationText} - UTC ${timezoneText}`} thumbnail={`https:${data.current.condition.icon}`}>
				{...Object.entries(weatherData).map(([name, value]) => <Field name={name} value={value} inline />)}
			</Embed>
		),
		(
			<Embed title="Air Quality" footerText="Data from weatherapi.com - Last Updated" timestamp={data.current.last_updated_epoch}>
				{...Object.entries(airQualityData).map(([name, value]) => <Field name={name} value={value} inline />)}
			</Embed>
		),
	]

	await interaction.edit({ embeds })
}

export const autocomplete: AutocompleteHandler<typeof cmd.options> = async (bot, interaction, args) => {
	if (!WeatherKey) return await interaction.respond(defaultChoice("No API Key provided"))

	const value = args.focused.value as string
	const response: ApplicationCommandOptionChoice[] = []

	if (!value || value.length === 0) return interaction.respond(defaultChoice("KeepTyping"))

	const { data } = await axiod.get<Search[]>("https://api.weatherapi.com/v1/search.json", {
		params: {
			key: WeatherKey,
			q: value,
		},
	})
	if (data.length === 0) return interaction.respond(defaultChoice("NoResults"))

	const choices: ApplicationCommandOptionChoice[] = data.map(option => ({
		name: [option.name, option.region, option.country].filter(e => e.length).join(", "),
		value: option.url.slice(0, 100),
	}))

	const fuse = new Fuse(choices, { keys: ["name", "value"] })
	response.push(...fuse.search(value).map(option => option.item))
	response.push(...choices.filter(option => !response.includes(option)))

	await interaction.respond({ choices: response.slice(0, 25) })
}

interface Search {
	id: number
	name: string
	region: string
	country: string
	lat: number
	lon: number
	url: string
}

interface AirQuality {
	co: number
	no2: number
	o3: number
	so2: number
	pm2_5: number
	pm10: number
	"us-epa-index": number
	"gb-defra-index": number
}

interface Location {
	name: string
	region: string
	country: string
	lat: number
	lon: number
	tz_id: string
	localtime_epoch: number
	localtime: string
}

interface Current {
	last_updated_epoch: number
	temp_c: number
	temp_f: number
	condition: {
		text: string
		icon: string
	}
	wind_mph: number
	wind_kph: number
	wind_degree: number
	wind_dir: string
	pressure_mb: number
	pressure_in: number
	humidity: number
	cloud: number
	feelslike_c: number
	feelslike_f: number
	vis_km: number
	vis_miles: number
	uv: number
	gust_mph: number
	gust_kph: number
	air_quality: AirQuality
}

interface Astronomy {
	sunrise: string
	sunset: string
	moonrise: string
	moonset: string
	moon_phase: string
	moon_illumination: string
	is_moon_up: number
	is_sun_up: number
}

interface Forecast {
	location: Location
	current: Current
	forecast: {
		forecastday: [{
			date_epoch: number
			day: {
				maxtemp_c: number
				maxtemp_f: number
				mintemp_c: number
				mintemp_f: number
				totalsnow_cm: number
			}
			astro: Astronomy
		}]
	}
}
