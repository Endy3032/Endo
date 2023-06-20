import { dirname, join } from "std:path"

export async function saveCache(folder: string | string[], fileName: string, content: any, append = false) {
	folder = typeof folder === "string" ? folder : folder.join("/")
	const filePath = join(Deno.cwd(), "src", "cache", folder, fileName), encoder = new TextEncoder()

	await Deno.mkdir(dirname(filePath), { recursive: true })

	if (typeof content === "object") content = encoder.encode(JSON.stringify(content, null, 2))
	else if (["string", "number", "boolean", "bigint"].includes(typeof content)) {
		content = encoder.encode((content as string | number | boolean | bigint).toString())
	}

	return await Deno.writeFile(filePath, content, { append })
}

export async function getCache(folder: string | string[], fileName: string) {
	folder = typeof folder === "string" ? folder : folder.join("/")
	const filePath = join(Deno.cwd(), "src", "cache", folder, fileName), decoder = new TextDecoder()

	try {
		const content = await Deno.readFile(filePath)
		return decoder.decode(content)
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) return null
		else throw err
	}
}
