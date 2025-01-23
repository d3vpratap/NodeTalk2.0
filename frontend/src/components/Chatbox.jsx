import React, { useEffect, useRef, useState } from "react";
import "./Chatbox.css";
import { ChatState } from "../context/Chatcontext";
import axios from "axios";
import Messages from "./Messages";
import { Socket } from "socket.io-client";

const Chatbox = () => {
  
  const { selectedChat, user } = ChatState();
  const [message, setMessage] = useState("");
  const [newmessages, setNewmessages] = useState([]);
  const inputRef = useRef();

  // Handle typing input
  function typinghandle(e) {
    setMessage(e.target.value);
  }

  // Fetch messages for the selected chat
  async function fetchMessages() {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(
        `http://localhost:8000/${selectedChat._id}/message`,
        config
      );
      
      console.log(data);
      setNewmessages(data.messages);
      
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  }

  // Send a message
  async function sendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `http://localhost:8000/${selectedChat._id}/message`,
        { content: message },
        config
      );
      const { data } = response;
      // console.log(data);

      // Add the new message to the state
      setNewmessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    } catch (e) {
      console.error("Error sending message:", e);
    }
  }

  // Fetch messages when the selected chat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat,setNewmessages]);
  useEffect(()=>{

  },[])
  // If no chat is selected
  if (!selectedChat) {
    return <div className="chatArea">No chat selected</div>;
  }

  return (
    <div className="chatArea">
      <div className="users-list">
        <strong key={selectedChat._id}>{selectedChat.chatName}</strong>
        <ul className="ul">
          {selectedChat.users.map((user) => (
            <li className="li">
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Messages newmessages={newmessages}/>
      </div>
      <div className="input">
        <input
          ref={inputRef}
          onChange={typinghandle}
          type="text"
          className="inputVal"
          value={message}
          placeholder="Type your text here..."
        />
        <button onClick={sendMessage} className="btn btn-sm btn-success">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
