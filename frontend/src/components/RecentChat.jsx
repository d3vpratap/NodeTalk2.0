import React, { useEffect, useState } from "react";
import { ChatState } from "../context/Chatcontext";
import "./RecentChat.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecentChat = () => {
  const navigate = useNavigate();
  
  const { loading, chats, setChats, user, setSelectedChat, selectedChat,refresh,setRefresh } = ChatState();

  async function handleDelete(id) {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      if (selectedChat && selectedChat._id === id) {
        setSelectedChat(null);
      }
      const response = await axios.delete("/chats", {data:{ id }}, config);
      
      if (response.status === 200) {
        console.log(chats);
        const updatedChats = chats.filter((chat) => chat.id !== id);
        setChats(updatedChats);
        setRefresh(!refresh);
      }
    } catch (e) {}
  }
  async function accessChats() {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8000/chats?userId=${user._id}`,
        config
      );
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }

  useEffect(() => {
    console.log("working");
    accessChats();
  }, [loading,refresh]); // Empty dependency array ensures it runs only once

  return (
    <div className="recent-chats">
      <p className="text-primary">Recent Chats</p>
      <ul className="ul">
        {chats &&
          chats.map((chat) => (
            <li className="li" key={chat._id}>
              <strong onClick={() => setSelectedChat(chat)}>
                {chat.chatName}
              </strong>
              <button
                onClick={() => handleDelete(chat._id)}
                style={{ margin: "1px" }}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RecentChat;
