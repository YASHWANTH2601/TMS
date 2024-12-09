import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if response is ok
        if (res.ok) {
          const response = await res.json();
          if (response && response.data) {
            setTitle(response.data.title);
            setDescription(response.data.description);
            setStatus(response.data.status);
          } else {
            alert("Task data not found.");
          }
        } else {
          alert("Failed to fetch task details.");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to fetch task details.");
      } finally {
        setLoading(false); // Set loading to false after the fetch operation
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const token = localStorage.getItem("token");
    const form = {
      title,
      description,
      status,
    };
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating task. Please try again.");
    }
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading task details...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditTask;
