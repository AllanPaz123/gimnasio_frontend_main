import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoriaEquipo from "./pages/inventario/CategoriaEquipo";
import Mantenimiento from "./pages/inventario/Mantenimiento";
import Equipo from "./pages/inventario/Equipo";
import PlanMembresia from "./pages/pagos/Plan_membresia";
import Membresia from "./pages/pagos/Membresia";
import Pago from "./pages/pagos/Pago";
import Usuario from "./pages/usuarios/Usuario";
import Cliente from "./pages/usuarios/Cliente";
import Rol from "./pages/usuarios/Rol";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  console.log("App component rendered");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/" element={<Home />} />

      {/* Rutas solo admin */}
      <Route
        path="/categoria-equipo"
        element={
          <ProtectedRoute requireAdmin>
            <CategoriaEquipo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mantenimiento"
        element={
          <ProtectedRoute requireAdmin>
            <Mantenimiento />
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipo"
        element={
          <ProtectedRoute requireAdmin>
            <Equipo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan-membresia"
        element={
          <ProtectedRoute requireAdmin>
            <PlanMembresia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/membresia"
        element={
          <ProtectedRoute requireAdmin>
            <Membresia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pago"
        element={
          <ProtectedRoute requireAdmin>
            <Pago />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuario"
        element={
          <ProtectedRoute requireAdmin>
            <Usuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute requireAdmin>
            <Cliente />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rol"
        element={
          <ProtectedRoute requireAdmin>
            <Rol />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
