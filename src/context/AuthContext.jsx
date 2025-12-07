import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/autenticacion/perfil");
        setUser(response.data.usuario || null);
        setError(null);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setUser(null);
        setError("Sesión expirada. Inicia sesión nuevamente.");
        localStorage.removeItem("token");
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [navigate, location.pathname]);

  const login = (token, callback) => {
    localStorage.setItem("token", token);
    // Después de guardar el token, recargar perfil
    (async () => {
      try {
        const response = await api.get("/api/autenticacion/perfil");
        setUser(response.data.usuario || null);
        setError(null);
        if (callback) callback();
      } catch (err) {
        console.error("Error al cargar perfil después de login:", err);
      }
    })();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
