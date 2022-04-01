import os from "os"
import morgan from "morgan"
import express from "express"
import { createWriteStream, existsSync, mkdirSync } from "fs"

const port = 3032
const server = express()

if (!existsSync("./Logs")) {mkdirSync("./Logs")}
var networkLog = !os.hostname().includes("local") ? createWriteStream("./Logs/network.log", { flags: "a" }) : null
server.use(morgan("[:date[web]] \":method\" :user-agent", { stream: networkLog }))

server.all("/", (_, res) => res.sendStatus(200))

export default function keepAlive() {
  server.listen(port, () => console.tagLog("Server", "Ready"))
}