import React, { useEffect, useState } from "react";
import { ChatState } from "../context/Chatcontext";
import io from "socket.io-client";
import "./Messages.css";

const Messages = ({ newmessages }) => {
  const ENDPOINT = "http://localhost:8000";
  const { refresh, selectedChat,user } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    console.log("re-render messages component");
  }, [refresh, newmessages]);

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connection",()=>{
        setSocketConnected(true);
    })
  }, []);

  return (
    <div className="messages-container">
      <div className="message">
        {newmessages.map((message) => {
          return (
            <div key={message._id} className="message-header">
              <p className="message-content">{message.content}</p>
              <p className="message"> {message.sender.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
