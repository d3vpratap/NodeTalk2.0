import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../context/Chatcontext";
const Home = () => {
  const { setUser } = ChatState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function onSubmit(d) {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8000/login", {
        email: d.email,
        password: d.password,
      });
      console.log(data);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      navigate("/chat");
      console.log("loginSuccessfully!");
      setLoginError("Unexpected error occurred. Please try again.");
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Network error, please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="homePage">
      <div className="container p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="form-label p-4">
          <h1 className="text-secondary">Login</h1>
          <div>
            <label className="text-secondary m-4">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              {...register("email", { required: "Email is required" })}
              placeholder="type your email"
              type="email"
            />
          </div>
          <div>
            <label className="text-secondary m-4 " id="password">
              Password:
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              {...register("password", { required: "Password is required" })}
              className="m-1"
              placeholder="password"
              type="password"
              name="password"
            />
          </div>
          <Button type="submit" className="mt-3" variant="success">
            {loading ? "Loading" : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
