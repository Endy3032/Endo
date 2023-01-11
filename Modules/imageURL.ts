type ID = string | number | BigInt | null | undefined
type Endpoints = "app-icons" | "avatars" | "banners" | "discovery-splashes" | "icons" | "role-icons" | "splashes"
type Options = {
	format: "jpg" | "jpeg" | "png" | "webp" | "gif" | "json"
	size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
}

export const imageURL = (targetID: ID, hash: ID, endpoint: Endpoints, options?: Options): string => {
	if (targetID === undefined || hash === undefined || targetID === null || hash === null) return ""

	hash = hash.toString(16)
	const animated = hash.startsWith("a")
	hash = animated ? hash.replace(/^a(?!_)/, "a_") : hash.startsWith("b") ? hash.slice(1) : hash

	const { format, size } = Object.assign<Options, Options | undefined>({ format: animated ? "gif" : "png", size: 1024 }, options)

	return `https://cdn.discordapp.com/${endpoint}/${targetID}/${hash}.${format}?size=${size}&quality=lossless`
}
