const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 5000; //runs on local host 5000

app.use(express.static("public"));

http.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

io.on("connection", (socket) => {
  console.log("Somebody connected");
  socket.on("create or join", (room) => {
    console.log("create or join the room", room);
    room = room.trim();
    const myRoom = io.sockets.adapter.rooms.get(room) || { size: 0 }; //to get the size of the room
    const numClients = myRoom.size;
    console.log(room, "has", numClients, "clients");

    //if room is empty and is to be created for the first time
    if (numClients === 0) {
      socket.join(room);
      socket.emit("created", room); //event "created" defined in main.js

      //if room is already created
    } else if (numClients === 1) {
      socket.join(room);
      socket.emit("joined", room); //event "joined" defined in main.js

      //room full
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("ready", (room) => {
    socket.broadcast.to(room).emit("ready");
  });

  socket.on("candidate", (event) => {
    socket.broadcast.to(event.room).emit("candidate", event);
  });

  socket.on("offer", (event) => {
    //offer call
    socket.broadcast.to(event.room).emit("offer", event.sdp);
  });

  socket.on("answer", (event) => {
    //answer call
    socket.broadcast.to(event.room).emit("answer", event.sdp);
  });
});
