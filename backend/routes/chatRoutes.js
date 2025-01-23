const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat"); // Import the Chat model
const authenticate = require("../middlewares/Authentication"); // Example auth middleware
const User = require("../models/User");

router.get("/search", authenticate, async (req, res) => {
  try {
    const searchValue = req.query.search;
    // console.log(searchValue);
    const users = await User.find({
      name: { $regex: searchValue, $options: "i" },
    });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching results!" + e });
  }
});
router.post("/chats", async (req, res) => {
  try {
    const { id, user } = req.body;
    const friend = await User.findById(id);
    console.log(friend.name);
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [user._id, friend.id] }, // `$all` checks if both users are present
    });
    if (existingChat) {
      return res
        .status(200)
        .json({ message: "Chat already exists", chat: existingChat });
    }
    const newChat = await Chat.create({
      chatName: friend.name, // or generate a unique name if needed
      isGroupChat: false,
      users: [user._id, friend.id],
    });
    return res
      .status(201)
      .json({ message: "Chat created successfully", chat: newChat });
  } catch (e) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/chats", authenticate, async (req, res) => {
  try {
    const { userId } = req.query;
    const chats = await Chat.find({ users: userId }).populate(
      "users",
      "name email"
    );
    return res.status(201).json(chats);
  } catch (e) {
    console.log("Chats not fetched!");
    return res.status(404).json({ message: "Cannot Fetch Chats" });
  }
});
router.delete("/chats", async (req, res) => {
  try {
    const { id } = req.body;
    await Chat.findByIdAndDelete(id);
    return res.status(200).json({ message: "Chat deleted Successfully" });
  } catch (e) {
    req.status(402).json({ message: "Errorn Deleteing Chat" });
  }
});

router.post("/create-group",authenticate, async(req, res) => {
  const { groupName, users, admin } = req.body;
  const existingGroup = await Chat.findOne({
    chatName: groupName,
    isGroupChat: true,
    users: { $all: users }, // Ensure all users are included in the group
  });

  if (existingGroup) {
    return res.status(400).json({ message: "Group already exists!" });
  }
  try{
    const newGroupChat =  await Chat.create({chatName:groupName, isGroupChat:true,users:users,groupAdmin:admin})
   return res.status(201).json({message:"Group created successfully",chat:newGroupChat});
  }
  catch(e){
    res.status(403).json({message:"error creating group"})
  }
   
});
module.exports = router;
