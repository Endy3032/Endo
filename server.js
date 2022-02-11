const fs = require("fs")
const express = require("express")
const morgan = require("morgan")
const server = express()
const port = 3032

var httplog = fs.createWriteStream("./other/http.log", { flags: "a" })
server.use(morgan("[:date[web]] \":method :url\" :status :user-agent", { stream: httplog }))

server.all("/", (req, res) => {
  res.send("Website coming in the future\nStay tuned")
})

function keepAlive() {
  server.listen(port, () => {
    console.log("Server is Ready!")
  })
}

module.exports = keepAlive
