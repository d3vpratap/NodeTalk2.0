const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const authenticate = require('../middlewares/Authentication');
router.post("/:chatId/messages", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    if (!content || !chatId) {
      console.log("Invalid data passed");
      return res.status(400).json({ message: "Invalid data passed" });
    }

    const newMessage = {
      sender: req.user._id, // Assuming `authenticate` middleware adds `user` to `req`
      content: content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic"); // Populate sender details
      message = await message.populate("chat"); // Populate chat details
      message = await message
        .populate({
          path: "chat.users",
          select: "name email pic",
        })
        .execPopulate(); // Populate chat users
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
      res.status(201).json(message);
    } catch (err) {
      console.error("Error while saving message:", err);
      res.status(500).json({ message: "Failed to save message" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/chat/:chatId", authenticate, async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch chat by ID and populate its details
    const chat = await Chat.findById(chatId)
      .populate("users", "name email pic") // Populate users in the chat
      .populate("groupAdmin", "name email pic") // Populate group admin
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name email pic" }, // Populate the sender of the latest message
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

module.exports = router;
