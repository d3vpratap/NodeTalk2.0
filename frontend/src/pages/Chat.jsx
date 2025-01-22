import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chat.css";
import { useEffect } from "react";
import { ChatState } from "../context/Chatcontext";
import Chatbox from "../components/Chatbox";
import Sidebar from "../components/Sidebar";
const Chat = () => {
  const { user, setUser, selectedChat, refresh } = ChatState();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  if (user) {
    return (
      <div className="Main">
        <div className="sidebar">
          <Sidebar user={user} />
        </div>
        {selectedChat ? (
          <Chatbox chat={selectedChat} key={refresh} />
        ) : (
          <p>Select a chat to start chatting.</p>
        )}
      </div>
    );
  } else {
    return <p>Need to Login!</p>;
  }
};

export default Chat;
