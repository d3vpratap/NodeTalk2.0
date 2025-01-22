import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchRes.css";
import { ChatState } from "../context/Chatcontext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const SearchRes = (props) => {
  const { user, accessChat ,  chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const users = props.searchRes;
  //   console.log(users);
 
  return (
    <div className="search-results-container">
      {users && users.length > 0 ? (
        users.map((user) => (
          <div
            onClick={() => accessChat(user._id)}
            key={user.id || user.email}
            className="user-card"
          >
            <img src={user.pic} />
            <p onClick={accessChat} className="username">{user.name}</p>
          </div>
        ))
      ) : (
        <p style={{ margin: "5px" }} className="alert alert-danger">
          No results found.
        </p>
      )}
    </div>
  );
};

export default SearchRes;
