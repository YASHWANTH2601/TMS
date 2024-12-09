// components/Dashboard/AddTask.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const AddTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm({ title: "", description: "", status: "To Do" });
      alert("Task added successfully");
      navigate("/dashboard");
      //   fetchTasks();
    } else {
      alert("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
