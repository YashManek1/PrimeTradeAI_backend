import { useState, useEffect } from "react";
import api from "../utils/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id && !parsedUser._id) {
        parsedUser._id = parsedUser.id;
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    const userData = res.data.user;
    if (userData.id && !userData._id) {
      userData._id = userData.id;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username, email, password) => {
    await api.post("/users/register", { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, register, logout, loading };
};
