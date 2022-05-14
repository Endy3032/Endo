import { BitwisePermissionFlags } from "discordeno"

const permissionNames = Object.keys(BitwisePermissionFlags).map((permission: string) => {
  // return permission.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g)?.join(" ").replace("VAD", "Voice Activity)")
  return permission.split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ").replace("VAD", "(Voice Activity)")
})

export const permissions = Object.assign(...Object.values(BitwisePermissionFlags).map((val, index) => ({
  [val.toString()]: permissionNames[index]
})) as unknown as [string, string])
