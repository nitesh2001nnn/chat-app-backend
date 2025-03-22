const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
const user = {};
io.on("connection", (socket) => {
  socket.on("new-userjoined", (name) => {
    user[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("write", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: user[socket.id],
    });
  });

  socket.on("disconnect", message=>{
    socket.broadcast.emit("leave",user[socket.id]);
    delete user[socket.id];
  })
});

server.listen("8000");
