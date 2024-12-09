// components/Auth/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.error || "Login failed!");
    }
  };

  return (
    <div
      className="w-100 d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column w-50 h-50 juctify-content-center align-items-center border border-black p-3 box-shadow "
      >
        <h2 className="mb-5">Login</h2>
        <input
          className="mb-5 w-50 ps-3"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="mb-5 w-50 ps-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary mb-3" type="submit">
          Log In
        </button>
        <p>
          Don't have an account?
          <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
