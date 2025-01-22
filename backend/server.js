const chats = require("./Data/data");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Chat = require("./models/Chat");
const mongodb = require("./config/db");
const cors = require("cors");

mongodb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" })); // Update port as necessary
//require routes:
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

//routes
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

app.listen(8000, () => {
  console.log("Server Started at Port 8000!");
});
