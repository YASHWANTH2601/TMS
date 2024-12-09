// components/Dashboard/TaskList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    } else {
      alert("Failed to fetch tasks");
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Successfully Delete...");

    fetchTasks();
  };

  const updateTask = async (id) => {
    navigate(`/updatetask/${id}`);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = filter
    ? tasks.filter((task) => task.status === filter)
    : tasks;
  const addPage = () => {
    navigate("/addtask");
  };
  return (
    <div
      className=" d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="w-50 d-flex flex-column juctify-content-center align-items-center border border-black p-3 box-shadow "
        style={{ border: "1px solid black" }}
      >
        <h2>Task Dashboard</h2>
        <div>
          <select className="me-5" onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="btn btn-secondary" onClick={addPage}>
            add task
          </button>
        </div>
        <ul className="d-flex ">
          {filteredTasks.map((task) => (
            <li className="m-5" key={task._id}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <button className="me-4" onClick={() => updateTask(task._id)}>
                Update
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
