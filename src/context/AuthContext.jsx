import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    name: localStorage.getItem("name") || null,
  });

  useEffect(() => {
    // Check if the user is trying to access protected routes
    const isPublicRoute = ["/login", "/register"].includes(location.pathname);

    if (!auth.token && !isPublicRoute) {
      navigate("/login");
    }
  }, [auth.token, navigate, location.pathname]);

  const login = (token, role, name) => {
    setAuth({ token, role, name });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    navigate("/dashboard"); // Navigate after login
  };

  const logout = () => {
    setAuth({ token: null, role: null, name: null });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login"); // Navigate after logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
