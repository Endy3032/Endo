import { Color } from "colorConvert"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { getSubcmd, getValue, randRange, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "color",
	description: "Return a preview of the color",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "random",
			description: "Feeling lucky?",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "rgb",
			description: "Get a color from RGB values",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "red",
					description: "Red [Integer 0~255] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 255,
					required: true,
				},
				{
					name: "green",
					description: "Green [Integer 0~255] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 255,
					required: true,
				},
				{
					name: "blue",
					description: "Blue [Integer 0~255] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 255,
					required: true,
				},
			],
		},
		{
			name: "decimal",
			description: "Get a color from decimal value",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "value",
					description: "Decimal value [Integer 0~16777215] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 16777215,
					required: true,
				},
			],
		},
		{
			name: "hex",
			description: "Get a color from hex value",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "value",
					description: "Hex value [Hex String 000000~FFFFFF] (Fallback: 000000)",
					type: ApplicationCommandOptionTypes.String,
					required: true,
				},
			],
		},
		{
			name: "hsl",
			description: "Get a color from HSL values",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "hue",
					description: "Hue [Integer 0~360] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 360,
					required: true,
				},
				{
					name: "saturation",
					description: "Saturation [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
				{
					name: "value",
					description: "Lightness [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
			],
		},
		{
			name: "hsv",
			description: "Get a color from HSV values",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "hue",
					description: "Hue [Integer 0~360] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 360,
					required: true,
				},
				{
					name: "saturation",
					description: "Saturation [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
				{
					name: "value",
					description: "Value [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
			],
		},
		{
			name: "cmyk",
			description: "Get a color from CMYK values",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "cyan",
					description: "The cyan value of the CMYK color [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
				{
					name: "magenta",
					description: "The magenta value of the CMYK color [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
				{
					name: "yellow",
					description: "The yellow value of the CMYK color [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
				{
					name: "key",
					description: "The key value of the CMYK color [Integer 0~100] (Fallback: 0)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 100,
					required: true,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	let color: Color

	switch (getSubcmd(interaction)) {
		case "rgb": {
			const red = getValue(interaction, "red", "Integer") ?? 0
			const green = getValue(interaction, "green", "Integer") ?? 0
			const blue = getValue(interaction, "blue", "Integer") ?? 0

			color = Color.rgb(red, green, blue)
			break
		}

		case "decimal": {
			const value = getValue(interaction, "value", "Integer") ?? 0
			const hex = value.toString(16)
			const [red, green, blue] = (hex.length === 3 ? hex.split("") : hex.padStart(6, "0").match(/../g)) ?? ["0", "0", "0"]

			color = Color.rgb(parseInt(red), parseInt(green), parseInt(blue))
			break
		}

		case "hex": {
			const value = getValue(interaction, "value", "String") ?? "000000"
			const matched = value.match(/[0-9a-f]{1,6}/gi)?.reduce((a, b) => Math.abs(b.length - 6) < Math.abs(a.length - 6) ? b : a)
				?? "000000"
			const hex = parseInt(matched, 16)

			color = Color.rgb(hex >> 16, (hex >> 8) & 0xFF, hex & 0xFF)
			break
		}

		case "hsl": {
			const hue = getValue(interaction, "hue", "Integer") ?? 0
			const saturation = getValue(interaction, "saturation", "Integer") ?? 0
			const lightness = getValue(interaction, "lightness", "Integer") ?? 0

			color = Color.hsl(hue, saturation, lightness)
			break
		}

		case "hsv": {
			const hue = getValue(interaction, "hue", "Integer") ?? 0
			const saturation = getValue(interaction, "saturation", "Integer") ?? 0
			const value = getValue(interaction, "value", "Integer") ?? 0

			color = Color.hsv(hue, saturation, value)
			break
		}

		case "cmyk": {
			const cyan = getValue(interaction, "cyan", "Integer") ?? 0
			const magenta = getValue(interaction, "magenta", "Integer") ?? 0
			const yellow = getValue(interaction, "yellow", "Integer") ?? 0
			const key = getValue(interaction, "key", "Integer") ?? 0

			color = Color.cmyk(cyan, magenta, yellow, key)
			break
		}

		default: {
			color = Color.rgb(randRange(0, 255), randRange(0, 255), randRange(0, 255))
			break
		}
	}

	const rgb = color.rgb()
	const cmyk = color.cmyk()
	const hex = color.hex()
	const hsl = color.hsl()
	const hsv = color.hsv()

	await respond(bot, interaction, {
		embeds: [{
			title: "Color Conversion",
			color: color.rgbNumber(),
			fields: [
				{ name: "RGB", value: [rgb.red(), rgb.green(), rgb.blue()].join(", "), inline: true },
				{ name: "CMYK", value: [cmyk.cyan(), cmyk.magenta(), cmyk.yellow(), cmyk.black()].join(", "), inline: true },
				{ name: "Decimal", value: `${color.rgbNumber()}`, inline: true },
				{ name: "HEX", value: hex, inline: true },
				{ name: "HSL", value: [hsl.hue(), hsl.saturation(), hsl.lightness()].join(", "), inline: true },
				{ name: "HSV", value: [hsv.hue(), hsv.saturation(), hsv.value()].join(", "), inline: true },
			],
			thumbnail: { url: `https://dummyimage.com/256/${hex.slice(1)}/${hex.slice(1)}.png` },
		}],
	})
}
