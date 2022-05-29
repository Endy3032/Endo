type Endpoints = "avatars" | "icons" | "banners"
type ID = BigInt | string | number | undefined | null
type Options = { format: "png" | "json" | "webp" | "gif"; size: number }

export const imageURL = (objectID: ID, imageID: ID, imageEndpoint: Endpoints, options: Options = { format: "webp", size: 2048 }): string => {
  if (objectID === undefined || imageID === undefined || objectID === null || imageID === null) return ""
  const hash = imageID.toString(16)
  return `https://cdn.discordapp.com/${imageEndpoint}/${objectID}/${hash.startsWith("a") ? `a_${hash.slice(1)}` : hash.slice(1)}.${options.format}?size=${options.size}?quality=lossless`
}
