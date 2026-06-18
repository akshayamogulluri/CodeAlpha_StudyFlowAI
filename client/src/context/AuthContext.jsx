import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("studyflow_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("studyflow_token"));

  const persistSession = (payload) => {
    localStorage.setItem("studyflow_token", payload.token);
    localStorage.setItem("studyflow_user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    persistSession(data);
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    persistSession(data);
  };

  const updateProfile = async (form) => {
    const { data } = await api.put("/auth/profile", form);
    localStorage.setItem("studyflow_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("studyflow_token");
    localStorage.removeItem("studyflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), register, login, logout, updateProfile }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
