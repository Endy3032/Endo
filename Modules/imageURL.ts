const size = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as const
type Size = typeof size[number]

type ID = string | number | BigInt | null | undefined
type Options = { format: "png" | "json" | "webp" | "gif"; size: Size }
type Endpoints = "avatars" | "banners" | "icons" | "splashes" | "discovery-splashes" | "role-icons"

export const imageURL = (targetID: ID, hash: ID, endpoint: Endpoints, options?: Options): string => {
	if (targetID === undefined || hash === undefined || targetID === null || hash === null) return ""

	options = Object.assign({ format: "png", size: 1024 }, options)
	const { format, size } = options
	hash = hash.toString(16)

	return `https://cdn.discordapp.com/${endpoint}/${targetID}/${hash}.${format}?size=${size}?quality=lossless`
}
