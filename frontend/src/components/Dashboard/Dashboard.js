import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks({ autoFetch: true });
  const [taskToEdit, setTaskToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleCreate = async (task) => {
    try {
      await createTask(task);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleUpdate = async (updated) => {
    try {
      await updateTask(taskToEdit._id, updated);
      setTaskToEdit(null);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleEdit = (task) => setTaskToEdit(task);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>
          Welcome, {user.username} ({user.role})
        </h2>
        <button onClick={handleLogout} style={{ marginRight: "10px" }}>
          Logout
        </button>
        {user.role === "admin" && (
          <Link to="/admin">
            <button>Go to Admin Panel</button>
          </Link>
        )}
      </div>

      <h3>{taskToEdit ? "Edit Task" : "Add New Task"}</h3>
      <TaskForm
        onSubmit={taskToEdit ? handleUpdate : handleCreate}
        editingTask={taskToEdit}
      />
      <h3>Your Tasks</h3>
      {tasksLoading ? (
        "Loading..."
      ) : (
        <TaskList tasks={tasks} onDelete={deleteTask} onEdit={handleEdit} />
      )}
    </div>
  );
};
export default Dashboard;
