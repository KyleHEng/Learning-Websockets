const express = require("express");
const { Server } = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:5500"],
  },
});

//connection even
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
  //upon connection- sent to user
  socket.emit("message", "Welcome to Chat App!");
  //upon connection - sent to everyone else
  socket.broadcast.emit("message", `user ${socket.id} connected`);

  //Listening for message event
  socket.on("message", (data) => {
    console.log(data);

    io.emit("message", `${socket.id} : ${data}`);
  });

  //When a user disconnects, send message to others in the chat
  socket.on("disconnect", () => {
    socket.broadcast.emit("message", `User: ${socket.id} has disconnected`);
  });

  //Listen for activity
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
});
