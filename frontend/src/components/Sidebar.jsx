import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../context/Chatcontext";
import { useNavigate } from "react-router-dom";
import SearchRes from "./SearchRes";
import RecentChat from "./RecentChat";
import CreateGroup from "../mod/CreateGroup";
const Sidebar = (props) => {
  const { user,refresh, selectedChat, control, setControl } = ChatState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [searchResult, setSearchresult] = useState(null);
  useEffect(()=>{

  },[refresh,loading])
  const navigate = useNavigate();
  async function handleSearch() {
    setControl(true);
    setLoading(true);
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await axios.get(
        `http://localhost:8000/search?search=${search}`,
        config
      );
      console.log(response.data);
      setSearchresult(response.data);
      setLoading(false);
      setSearch("");
      // const users = response.JSON.stringify(response);
      // console.log(response.data);
    } catch (e) {
      console.log("Error", { message: e });
    }
  }
  const logoutHandler = () => {
    setLoading(true);
    localStorage.removeItem("userInfo");
    setLoading(false);
    navigate("/");
  };
  return (
    <div>
      <div className="search-top">
        <input
          type="search"
          placeholder="search user"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="searchBar"
        />
        <p className="user">Hello-{user.name}</p>
        <button className="btn btn-success btn-sm" onClick={handleSearch}>
          {loading ? "Searching" : "Search"}
        </button>
        <div className="group-action">
          <CreateGroup /> {/* Use the CreateGroup component */}
        </div>
      </div>
      <div className="searchRes">
        {control ? <SearchRes searchRes={searchResult} /> : <RecentChat />}
      </div>
      <div className="sideFoot">
        <button onClick={logoutHandler} className=" btn btn-sm btn-danger">
          logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
