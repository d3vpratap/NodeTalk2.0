const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const authenticate = require("../middlewares/Authentication");
router.post("/:chatId/message", authenticate, async (req, res) => {
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
      // Create the message
      let message = await Message.create(newMessage);

      // Populate sender details
      message = await Message.findById(message._id)
        .populate("sender", "name pic")
        .populate({
          path: "chat",
        });

      // Update the chat's latestMessage field
      await Chat.findByIdAndUpdate(
        chatId,
        { latestMessage: message },
        { new: true }
      );

      // Send the populated message as response
      res.status(201).json(message);
    } catch (err) {
      console.error("Error while saving message:", err);
      res
        .status(500)
        .json({ message: "Failed to save message", error: err.message });
    }
  } catch (err) {
    console.error("Internal error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.get("/:chatId/message", authenticate, async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch messages for the given chatId
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email") // Include sender details
      .populate({
        path: "chat",
        select: "chatName users", // Include chat name and users
        populate: { path: "users", select: "name email pic" }, // Populate users in the chat
      });
    console.log("Fetched messages with populated sender:", messages);

    // Check if messages exist
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Respond with the messages
    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      message: "Failed to fetch messages",
      error: err.message,
    });
  }
});

module.exports = router;
