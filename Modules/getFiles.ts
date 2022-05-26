export const getFiles = (dir: string, fileTypes: string[] | string | "folders" = "ts") => {
  const regex = new RegExp(`([.](${(typeof fileTypes == "string" ? [fileTypes] : [...fileTypes]).join("|")}))$`)
  return [...Deno.readDirSync(dir)]
    .filter(entry => fileTypes == "folders" ? entry.isDirectory : regex.test(entry.name))
    .map(entry => entry.name)
}
