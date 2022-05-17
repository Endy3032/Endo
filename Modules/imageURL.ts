type ID = BigInt | string | number | undefined | null
type Endpoints = "avatars" | "icons" | "banners"
type Options = { format: "png" | "json" | "webp" | "gif", size: number }

export const imageURL = (objectID: ID, imageID: ID, imageEndpoint: Endpoints, options: Options = { format: "png", size: 4096 }): string => {
  if (objectID === undefined || imageID === undefined || objectID === null || imageID === null) return ""
  return `https://cdn.discordapp.com/${imageEndpoint}/${objectID}/${imageID.toString(16).slice(1)}.${options.format}?size=${options.size}`
}
