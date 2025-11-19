import React, { useState, useEffect } from 'react';
import api from '../api/http';
import Navbar from '../components/Navbar';
import '../App.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/clientes/listar');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      alert('Error al cargar la lista de clientes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
      <h1>Gestión de Clientes</h1>
      
      {loading && <p>Cargando...</p>}

      {!loading && clientes.length === 0 && (
        <p>No hay clientes registrados</p>
      )}

      {clientes.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Información</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cliente.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cliente.nombre}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {JSON.stringify(cliente)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}
