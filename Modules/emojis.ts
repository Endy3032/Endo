const emojiNames = ["success", "warn", "error", "trash", "WeatherAPI"] as const
type emojiName = typeof emojiNames[number]

export const emojis: { [key in emojiName]: bigint } = {
	success: 959424285217271859n,
	warn: 959424285162766377n,
	error: 959424285275992074n,
	trash: 962374647104569365n,
	WeatherAPI: 932557801153241088n,
}

export const shorthand = (name: emojiName): `<:${emojiName}:${string}>` => `<:${name}:${emojis[name]}>`
