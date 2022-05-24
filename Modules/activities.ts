import { Temporal } from "temporal"
import { pickFromArray } from "./random.ts"
import { ActivityTypes, StatusUpdate } from "discordeno"

type YouTubeVideoBaseURL = "https://www.youtube.com/watch?v="
type Activity = {
  [key in Exclude<keyof typeof ActivityTypes, "Custom" | "Competing">]: { name: string; url?: `${YouTubeVideoBaseURL}${string}` }[]
}

const status: Activity = {
  Game: [
    { name: "Deno" },
    { name: "Replit" },
    { name: "VSCode" },
    { name: "Discordeno" },
  ],
  Listening: [
    { name: "/help" },
    { name: "🌧agoraphobic🌧" },
    { name: "llusion - jealous" },
  ],
  Watching: [
    { name: "Stranger Things" },
    { name: "Thinger Strangs" },
  ],
  Streaming: [
    { name: "lofi", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { name: "lofi", url: "https://www.youtube.com/watch?v=9FIkzOrryf8" },
    { name: "lofi", url: "https://www.youtube.com/watch?v=5qap5aO4i9A" },
    { name: "lofi", url: "https://www.youtube.com/watch?v=DWcJFNfaw9c" },
    { name: "lofi", url: "https://www.youtube.com/watch?v=TsTtqGAxvWk" },
    { name: "lofi", url: "https://www.youtube.com/watch?v=CIfGUiICf8U" },
  ],
}

function getActivity() {
  const statusTypeKey = pickFromArray(Object.keys(status))
  const { name, url } = pickFromArray(status[statusTypeKey])
  return {
    name, url,
    type: parseInt(ActivityTypes[statusTypeKey]) ?? ActivityTypes.Streaming,
    createdAt: Temporal.Now.instant().epochMilliseconds
  }
}

export function activities(): StatusUpdate {
  return {
    activities: [getActivity()],
    status: "idle"
  }
}
