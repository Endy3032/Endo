type Size = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096

type ID = string | number | BigInt | null | undefined
type Options = { format: "png" | "json" | "webp" | "gif"; size: Size }
type Endpoints = "app-icons" | "avatars" | "banners" | "discovery-splashes" | "icons" | "role-icons" | "splashes"

export const imageURL = (targetID: ID, hash: ID, endpoint: Endpoints, options?: Options): string => {
	if (targetID === undefined || hash === undefined || targetID === null || hash === null) return ""

	hash = hash.toString(16)
	hash = `${hash.replace(/^a/, "a_")}${hash.slice(1)}`
	const { format, size } = Object.assign({ format: "png", size: 1024 }, options)

	return `https://cdn.discordapp.com/${endpoint}/${targetID}/${hash}.${format}?size=${size}?quality=lossless`
}
