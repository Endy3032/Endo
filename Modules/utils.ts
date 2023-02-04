export function capitalize(content: string, lower?: boolean) {
	return content[0].toUpperCase() + (lower ? content.slice(1).toLowerCase() : content.slice(1))
}

export function toTimestamp(id: BigInt, type?: "ms"): bigint
export function toTimestamp(id: BigInt, type?: "s" | undefined): number
export function toTimestamp(id: BigInt, type: "ms" | "s" = "s"): bigint | number {
	const ms = id.valueOf() / 4194304n + 1420070400000n
	return type === "ms" ? ms : Math.floor(Number(ms / 1000n))
}

export function getFiles(dir: string, options?: { fileTypes?: string[] | string | "folders"; filterMod?: boolean }) {
	const { fileTypes, filterMod } = Object.assign({ fileTypes: "ts", filterMod: true }, options)

	const regex = new RegExp(`\\.(${(typeof fileTypes === "string" ? [fileTypes] : fileTypes).join("|")})$`)
	return [...Deno.readDirSync(dir)]
		.filter(entry =>
			(fileTypes === "folders" ? entry.isDirectory : entry.isFile && regex.test(entry.name))
			&& (filterMod ? entry.name !== "mod.ts" : true)
		)
		.map(entry => entry.name)
}

// #region Image URL
type ID = string | number | BigInt | null | undefined
type Endpoints = "app-icons" | "avatars" | "banners" | "discovery-splashes" | "icons" | "role-icons" | "splashes"
type Options = {
	format: "jpg" | "jpeg" | "png" | "webp" | "gif" | "json"
	size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
}

export function imageURL(targetID: ID, hash: ID, endpoint: Endpoints, options?: Options): string {
	if (targetID === undefined || hash === undefined || targetID === null || hash === null) return ""

	hash = hash.toString(16)
	const animated = hash.startsWith("a")
	hash = animated ? hash.replace(/^a(?!_)/, "a_") : hash.startsWith("b") ? hash.slice(1) : hash

	const { format, size } = Object.assign<Options, Options | undefined>({ format: animated ? "gif" : "png", size: 1024 }, options)

	return `https://cdn.discordapp.com/${endpoint}/${targetID}/${hash}.${format}?size=${size}&quality=lossless`
}
// #endregion

// #region Random
export function randRange(lower: number, upper = 0) {
	if (lower > upper) [upper, lower] = [lower, upper]
	return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export function pickArray(arr: any[]) {
	return arr[randRange(arr.length * 10) % arr.length]
}
// #endregion
