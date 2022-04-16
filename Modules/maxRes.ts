export default (link: string) => {
  var url = new URL(link.replace(/.(jpg|jpeg|webp)/gi, ".png"))
  url.searchParams.delete("size")
  url.searchParams.set("size", "4096")
  return url.href
}
