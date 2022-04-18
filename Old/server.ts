import os from "os"
import morgan from "morgan"
import express from "express"
import { createWriteStream } from "fs"
import { localTagLog } from "./Modules"

const port = 3032
const server = express()

var networkLog = !os.hostname().includes("local") ? createWriteStream("./Resources/network.log", { flags: "a" }) : null
server.use(morgan("[:date[web]] :method :user-agent", { stream: networkLog }))

server.all("/", (_, res) => res.sendStatus(200))

export default function keepAlive() {
  server.listen(port, () => localTagLog("Server", "Ready"))
}