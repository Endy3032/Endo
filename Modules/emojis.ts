interface Emojis {
  [key: string]: { name: string, id: string, shorthand?: string}
}

const emojis: Emojis = {
  success: { name: "success", id: "959424285217271859" },
  warn: { name: "warn", id: "959424285162766377" },
  error: { name: "error", id: "959424285275992074" },
  trash: { name: "trash", id: "927050313943380089" },
  WeatherAPI: { name: "WeatherAPI", id: "932557801153241088" },
}

Object.keys(emojis).forEach(emoji => {
  emojis[emoji].shorthand = `<:${emojis[emoji].name}:${emojis[emoji].id}>`
})

export default emojis
