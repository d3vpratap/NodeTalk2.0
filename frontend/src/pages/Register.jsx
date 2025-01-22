import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "../components/Navbar";
import { useForm } from "react-hook-form";
const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(d) {
    try {
      const { data } = await axios.post("http://localhost:8000/register", {
        name: d.username,
        email: d.email,
        password: d.password,
      });
      //   console.log("Success:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("authToken", data.token);
      navigate("/chat");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  }

  return (
    <div className="homePage">
      <Navbar />
      <div className="container p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="form-label p-4">
          <h1 className="text-secondary">Register</h1>
          <div>
            <label className="text-secondary m-4">Name:</label>
            <input
              {...register("username")}
              placeholder="username"
              type="text"
            />
          </div>
          <div>
            <label className="text-secondary m-4">Email:</label>
            <input
              {...register("email")}
              placeholder="email@gmail.com"
              type="text"
            />
          </div>
          <div>
            <label className="text-secondary m-4 " id="password">
              Password:
            </label>
            <input
              {...register("password")}
              className="m-1"
              placeholder="password"
              type="password"
              name="password"
            />
          </div>
          <Button type="submit" className="mt-3" variant="success">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
