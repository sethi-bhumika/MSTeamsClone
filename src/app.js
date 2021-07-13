let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./public/stream");
let path = require("path");

const port = process.env.PORT || 5000;

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.of("/stream").on("connection", stream);

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
