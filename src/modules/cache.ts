import { dirname, join } from "std:path"
import { Temporal } from "temporal"
import { TimeMetric } from "./exports.ts"

export async function saveCache(folder: string | string[], fileName: string, content: any, append = false) {
	const filePath = join(Deno.cwd(), "src", "cache", Array.isArray(folder) ? join(...folder) : folder, fileName)

	await Deno.mkdir(dirname(filePath), { recursive: true })

	if (typeof content === "object") content = JSON.stringify(content, null, 2)
	else if (["string", "number", "boolean", "bigint"].includes(typeof content)) content = content.toString()

	return await Deno.writeTextFile(filePath, content, { append })
}

export async function getCache(folder: string | string[], fileName: string) {
	const filePath = join(Deno.cwd(), "src", "cache", Array.isArray(folder) ? join(...folder) : folder, fileName)

	try {
		return await Deno.readTextFile(filePath)
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) return null
		else throw err
	}
}

export async function getCacheOrFetch<T>(
	path: string | string[],
	fileName: string,
	cacheDays: number,
	fetchData: () => Promise<any>,
): Promise<T> {
	const reloadCache = async () => {
		const content = await fetchData()
		await saveCache(path, fileName, content)
		return content
	}

	const cache = await getCache(path, fileName)
	if (!cache) return await reloadCache()

	try {
		const parsed = JSON.parse(cache)
		if (parsed.timestamp < Temporal.Now.instant().epochSeconds - cacheDays * TimeMetric.sec_day) return await reloadCache()
		return parsed as T
	} catch (e) {
		console.botLog(e, { tag: "Cache", logLevel: "ERROR" })
		return cache as T
	}
}
