import { useState, useEffect } from "react";
import api from "../utils/api";

export const useTasks = ({ autoFetch = true } = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(err);
      if (err.response?.status !== 401) {
        console.error("Error fetching tasks:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task) => {
    await api.post("/tasks", task);
    await fetchTasks();
  };

  const updateTask = async (id, updates) => {
    await api.put(`/tasks/${id}`, updates);
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && autoFetch) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [autoFetch]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
