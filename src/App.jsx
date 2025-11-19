import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import CategoriaEquipo from './pages/inventario/CategoriaEquipo';
import Mantenimiento from './pages/inventario/Mantenimiento';
import Equipo from './pages/inventario/Equipo';
import PlanMembresia from './pages/pagos/Plan_membresia';
import Membresia from './pages/pagos/Membresia';
import Pago from './pages/pagos/Pago';


function App() {
  console.log('App component rendered');

  return (
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/categoria-equipo" element={<CategoriaEquipo />} />
        <Route path="/mantenimiento" element={<Mantenimiento />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/plan-membresia" element={<PlanMembresia />} />
        <Route path="/membresia" element={<Membresia />} />
        <Route path="/pago" element={<Pago />} />
      </Routes>
   
  )
}

export default App
