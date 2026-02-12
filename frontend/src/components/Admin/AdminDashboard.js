import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const AdminDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [usersRes, tasksRes] = await Promise.all([
        api.get("/users/admin/all"),
        api.get("/tasks/admin/all"),
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchAdminData();
  }, [user, authLoading, navigate, fetchAdminData]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/admin/${userId}/role`, { role: newRole });
      setError("");
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change role");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/admin/${taskId}`);
      setError("");
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading admin data...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Admin Dashboard</h1>
        <p>
          Welcome, {user?.username} ({user?.role})
        </p>
        <button onClick={handleLogout} style={{ marginRight: "10px" }}>
          Logout
        </button>
        <button onClick={() => navigate("/dashboard")}>Go to My Tasks</button>
      </div>
      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            border: "1px solid red",
            marginBottom: "20px",
            backgroundColor: "#ffe6e6",
          }}
        >
          {error}
        </div>
      )}
      <section style={{ marginBottom: "40px" }}>
        <h2>All Users ({users.length})</h2>
        {users.length === 0 ? (
          <p style={{ color: "gray" }}>No users found.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <strong>{u.role}</strong>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u._id !== user?._id ? (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <em>(You)</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section>
        <h2>All Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p style={{ color: "gray" }}>No tasks found.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          task.status === "completed"
                            ? "#90EE90"
                            : task.status === "in-progress"
                            ? "#FFD700"
                            : "#FFA07A",
                      }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.userId?.username || "Unknown"} (
                    {task.userId?.email || "N/A"})
                  </td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
