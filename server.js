const os = require("os")
const morgan = require("morgan")
const express = require("express")
const { createWriteStream } = require("fs")

const server = express()
const port = 3032

var httplog = createWriteStream("./logs/http.log", { flags: "a" })
server.use(morgan("[:date[web]] \":method :url\" :status :user-agent", { stream: os.hostname().includes("local") ? null : httplog }))

server.all("/", (_, res) => {
  res.send("Website coming in the future\nStay tuned")
})

function keepAlive() {
  server.listen(port, () => {console.tagLog("Server", "Ready")})
}

module.exports = keepAlive
