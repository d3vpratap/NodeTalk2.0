import React, { useEffect } from "react";
import "./Chatbox.css";
import { ChatState } from "../context/Chatcontext";
const Chatbox = () => {
  const { selectedChat, refresh, user } = ChatState();
  useEffect(() => {
    console.log("chatbox re-rendered!");
    console.log(selectedChat.users);
  }, [refresh]);

  if (!selectedChat) {
    return <div className="chatArea">No chat selected</div>;
  }

  return (
    <div className="chatArea">
      <div className="users-list">
        <strong>{selectedChat.chatName}</strong>
        <ul className="ul">
          {selectedChat.users.map((user) => {
            return (
              <li className="li" key={user._id}>
                {user.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="input ">
        <input
          type="text"
          className="inputVal"
          placeholder="type your text here ...."
        />
        <button className="btn btn-sm btn-success">Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
