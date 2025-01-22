import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
    
  return (
    <ul className="navbar">
      <li className="li">
        <Link to="/">Login</Link>
      </li>
      <li className="li">
        <Link to="/register">Register</Link>
      </li>
      <li className="li">
        <Link to="/chat">Chats</Link>
      </li>
    </ul>
  );
};

export default Navbar;
