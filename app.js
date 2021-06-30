const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const port = process.env.PORT || 5000; //runs on local host 5000

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

io.on("connection", (socket) => {
  console.log("Somebody connected");
  socket.on("create or join", (data) => {
    console.log("create or join the room", data.room);
    socket.join(data.room);
    socket.join(data.socketId);
    const myRoom = io.sockets.adapter.rooms.get(data.room) || { size: 0 }; //to get the size of the room
    const numClients = myRoom.size;
    console.log(room, "has", numClients, "clients");

    //if room is empty and is to be created for the first time
    if (numClients > 1) {
      socket.to(data.room).emit("new user", { socketId: data.socketId });
    }
  });

  socket.on("newUserStart", (data) => {
    socket.to(data.to).emit("newUserStart", { sender: data.sender });
  });

  socket.on("sdp", (data) => {
    socket
      .to(data.to)
      .emit("sdp", { description: data.description, sender: data.sender });
  });

  socket.on("ice candidates", (data) => {
    socket.to(data.to).emit("ice candidates", {
      candidate: data.candidate,
      sender: data.sender,
    });
  });
});
