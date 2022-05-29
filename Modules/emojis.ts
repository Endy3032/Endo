type Emojis = {
  [key: string]: { name: string; id: string; animated?: boolean; shorthand?: string }
}

const emojis: Emojis = {
  success: { name: "success", id: "959424285217271859" },
  warn: { name: "warn", id: "959424285162766377" },
  error: { name: "error", id: "959424285275992074" },
  trash: { name: "trash", id: "962374647104569365" },
  WeatherAPI: { name: "WeatherAPI", id: "932557801153241088" },
}

Object.keys(emojis).forEach(emoji => {
  emojis[emoji].shorthand = `<${emojis[emoji].animated ? "a" : ""}:${emojis[emoji].name}:${emojis[emoji].id}>`
})

export { emojis }
