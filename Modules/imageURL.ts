export const imageURL = (objectID: BigInt | number | undefined, imageID: BigInt | number | undefined, imageEndpoint: "avatars" | "icons" | "banners", options: { format: "png" | "json" | "webp" | "gif", size: number } = { format: "png", size: 4096 }): string | undefined => {
  if (objectID === undefined || imageID === undefined) return undefined
  return `https://cdn.discordapp.com/${imageEndpoint}/${objectID}/${imageID.toString(16).slice(1)}.${options.format}?size=${options.size}`
}
