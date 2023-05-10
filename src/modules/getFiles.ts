import { join } from "std:path"

type FileTypes = "json" | "ts" | "tsx" | "folders"

type Options = {
	fileTypes: Exclude<FileTypes, "folders">[] | FileTypes
	filterMod?: boolean
	regex?: RegExp
}

const defaultOptions = {
	fileTypes: ["ts", "tsx"],
	regex: /^[^_]+.*$/,
	filterMod: true,
} satisfies Options

export function getFiles(dir: string | URL, options: Options = defaultOptions) {
	const { fileTypes, filterMod, regex } = Object.assign<typeof defaultOptions, Options>(Object.create(defaultOptions), options)

	const extRE = new RegExp(`\\.(${typeof fileTypes === "string" ? fileTypes : fileTypes.join("|")})$`)

	return [...Deno.readDirSync(dir instanceof URL ? dir : join(Deno.cwd(), "src", dir))]
		.filter(entry =>
			(fileTypes === "folders" ? entry.isDirectory : (entry.isFile && extRE.test(entry.name)))
			&& (filterMod ? entry.name !== "mod.ts" : true)
			&& regex.test(entry.name)
		)
		.map(entry => entry.name)
}
