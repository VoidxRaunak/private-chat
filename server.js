const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    socket.to(room).emit("system-message", `${username} joined the chat 👋`);
  });

  socket.on("send-message", (message) => {
    if (!socket.room) return;

    io.to(socket.room).emit("receive-message", {
      username: socket.username,
      message: message
    });
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.to(socket.room).emit(
        "system-message",
        `${socket.username} left the chat`
      );
    }
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Chat server running on port ${PORT}`);
});
  console.log("Chat server running at http://localhost:3000");
});