export const getFiles = (dir: string, fileTypes: string[] | string = "ts") => {
  const regex = new RegExp(`([.](${(typeof fileTypes == "string" ? [fileTypes] : [...fileTypes]).join("|")}))$`)
  return [...Deno.readDirSync(dir)]
    .filter(file => regex.test(file.name))
    .map(file => file.name)
}
