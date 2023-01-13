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
