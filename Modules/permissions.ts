import { capitalize } from "./capitalize.ts"
import { BitwisePermissionFlags } from "discordeno"

export const permissionNames = Object.keys(BitwisePermissionFlags).filter(key => !parseInt(key)).map((permission: string) => {
  // return permission.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g)?.join(" ").replace("VAD", "Voice Activity)")
  return permission.split("_")
    .map(word => capitalize(word, { lower: true }))
    .join(" ").replace("Vad", "Voice Activity")
})

export const permissions = Object.assign(...Object.values(BitwisePermissionFlags).filter(value => typeof value !== "string").map((val, ind) => ({
  [val.toString()]: permissionNames[ind]
})) as unknown as [string, string])
