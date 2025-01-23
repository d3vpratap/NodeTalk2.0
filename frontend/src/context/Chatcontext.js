import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState(null);
  const[control , setControl] = useState(false);
  const [refresh, setRefresh] = useState(false);


  async function accessChat(id) {
    setLoading(true);
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/chats",
        { id, user },
        config
      );
      setLoading(false);
      setSelectedChat(data.chat);
      setControl(false);
      // console.log(selectedChat);
    } catch (e) {
      console.log("error", { message: e });
    }
  }



  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        accessChat,
        control,
        setControl,
        refresh,
        setRefresh,
        loading,
        setLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
