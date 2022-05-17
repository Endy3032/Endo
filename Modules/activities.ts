import { Temporal } from "temporal"
import { pickFromArray } from "./random.ts"
import { ActivityTypes, StatusUpdate } from "discordeno"

type ActivityType = {
  name: string
  type: ActivityTypes
  url?: string
}

const status: ActivityType[] = [
  { name: "Deno", type: ActivityTypes.Game },
  { name: "Replit", type: ActivityTypes.Game },
  { name: "VSCode", type: ActivityTypes.Game },
  { name: "discordeno", type: ActivityTypes.Game },
  { name: "/help", type: ActivityTypes.Listening },
  { name: "🌧agoraphobic🌧", type: ActivityTypes.Listening },
  { name: "llusion - jealous", type: ActivityTypes.Listening },
  { name: "Stranger Things", type: ActivityTypes.Watching },
  { name: "Thinger Strangs", type: ActivityTypes.Watching },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=9FIkzOrryf8" },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=5qap5aO4i9A" },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=DWcJFNfaw9c" },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=TsTtqGAxvWk" },
  { name: "lofi", type: ActivityTypes.Streaming, url: "https://www.youtube.com/watch?v=CIfGUiICf8U" },
]

const getActivity = () => {
  const { name, type, url } = pickFromArray(status) as ActivityType
  return {
    name, type, url,
    createdAt: Temporal.Now.instant().epochMilliseconds
  }
}

export const activities: StatusUpdate = {
  activities: [getActivity()],
  status: "idle"
}
