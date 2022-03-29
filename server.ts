import os from "os"
import morgan from "morgan"
import express from "express"
import { createWriteStream, existsSync, mkdirSync } from "fs"

const server = express()
const port = 3032

if (!existsSync("./Logs")) {mkdirSync("./Logs")}
var networkLog = !os.hostname().includes("local") ? createWriteStream("./Logs/network.log", { flags: "a" }) : null
server.use(morgan("[:date[web]] \":method :url\" :status :user-agent", { stream: networkLog }))

server.all("/", (_, res) => {
  res.send("Website coming in the future\nStay tuned")
})

export default function keepAlive() {
  server.listen(port, () => {console.tagLog("Server", "Ready")})
}