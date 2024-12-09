// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import TaskList from "./components/Dashboard/TaskList";
import AddTask from "./components/Dashboard/AddTask";
import ProtectedRoute from "./components/ProtectedRoute";
import EditTask from "./components/Dashboard/EditTask";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<TaskList />} />}
      />
      <Route
        path="/addtask"
        element={<ProtectedRoute element={<AddTask />} />}
      />
      <Route
        path="/updatetask/:id"
        element={<ProtectedRoute element={<EditTask />} />}
      />
    </Routes>
  </Router>
);

export default App;
