import { iconBigintToHash } from "discordeno"

export const capitalize = (content: string, lower?: boolean) =>
	content[0].toUpperCase() + (lower ? content.slice(1).toLowerCase() : content.slice(1))

export const codeblock = (content: string | string[], language?: string) =>
	`\`\`\`${language ?? ""}\n${typeof content === "string" ? content : content.join("\n")}\n\`\`\``

export function randRange(lower: number, upper = 0) {
	if (lower > upper) [upper, lower] = [lower, upper]
	return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export const pickArray = <T>(arr: T[]): T => arr[randRange(arr.length * 10) % arr.length]

export function imageURL(targetID: ID, hash: ID, endpoint: Endpoints, options?: Options): string {
	if (targetID === undefined || hash === undefined || targetID === null || hash === null) return ""

	const { format, size } = Object.assign<Options, Options | undefined>({
		format: hash.toString(16).startsWith("a") ? "gif" : "png",
		size: 1024,
	}, options)

	return `https://cdn.discordapp.com/${endpoint}/${targetID}/${iconBigintToHash(BigInt(hash))}.${format}?size=${size}&quality=lossless`
}

type ID = string | number | bigint | null | undefined
type Endpoints = "app-icons" | "avatars" | "banners" | "discovery-splashes" | "icons" | "role-icons" | "splashes"
type Options = {
	format: "jpg" | "jpeg" | "png" | "webp" | "gif" | "json"
	size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
}
