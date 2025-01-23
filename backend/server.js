const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Chat = require("./models/Chat");
const mongodb = require("./config/db");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
mongodb();

//middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" })); // Update port as necessary

//require routes:
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Socket } = require("dgram");

//routes
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

//httpServer!
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 100000, //after this time it will close the connection to save bandwidth:
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//socketSetup::
io.on("connection", (socket) => {
  console.log("connected.socket.io");
  socket.on("setup", (userData) => {
    console.log(userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log("User joined room "+ room);
  })
});

//ServerListen(http:)
httpServer.listen(8000, () => {
  console.log("Server started at PORT *000");
});
