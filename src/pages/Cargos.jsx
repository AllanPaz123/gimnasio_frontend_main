import React, { useState, useEffect } from 'react';
import api from '../api/http';
import Navbar from '../components/Navbar';
import '../App.css';

export default function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCargoId, setSelectedCargoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'AC'
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    cargarCargos();
  }, []);

  const cargarCargos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/cargos/listar');
      setCargos(response.data);
    } catch (error) {
      console.error('Error al cargar cargos:', error);
      alert('Error al cargar la lista de cargos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      estado: 'AC'
    });
    setErrors([]);
    setEditMode(false);
    setSelectedCargoId(null);
  };

  const abrirModalNuevo = () => {
    limpiarFormulario();
    setShowModal(true);
  };

  const abrirModalEditar = (cargo) => {
    setFormData({
      nombre: cargo.nombre || '',
      estado: cargo.estado || 'AC'
    });
    setSelectedCargoId(cargo.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      if (editMode) {
        const response = await api.put(`/api/cargos/editar?id=${selectedCargoId}`, formData);
        alert(response.data.msj || 'Cargo actualizado correctamente');
      } else {
        const response = await api.post('/api/cargos/guardar', formData);
        alert(response.data.msj || 'Cargo guardado correctamente');
      }
      setShowModal(false);
      limpiarFormulario();
      cargarCargos();
    } catch (error) {
      console.error('Error al guardar cargo:', error);
      if (error.response?.data?.data) {
        setErrors(error.response.data.data);
      } else {
        alert('Error al guardar el cargo');
      }
    } finally {
      setLoading(false);
    }
  };

  const eliminarCargo = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cargo?')) {
      setLoading(true);
      try {
        await api.delete(`/api/cargos/eliminar?id=${id}`);
        alert('Cargo eliminado correctamente');
        cargarCargos();
      } catch (error) {
        console.error('Error al eliminar cargo:', error);
        alert('Error al eliminar el cargo');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
      <h1>Gestión de Cargos</h1>
      
      <button 
        onClick={abrirModalNuevo}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Nuevo Cargo
      </button>

      {loading && <p>Cargando...</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Nombre</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Estado</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargos.map((cargo) => (
            <tr key={cargo.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cargo.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cargo.nombre}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {cargo.estado === 'AC' ? 'Activo' : cargo.estado === 'IN' ? 'Inactivo' : 'Bloqueado'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button 
                  onClick={() => abrirModalEditar(cargo)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => eliminarCargo(cargo.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Formulario */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>{editMode ? 'Editar Cargo' : 'Nuevo Cargo'}</h2>
            
            {errors.length > 0 && (
              <div style={{ backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                <h4>Errores:</h4>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error.atributo}: {error.msj}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label>Nombre:*</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Estado:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="AC">Activo</option>
                  <option value="IN">Inactivo</option>
                  <option value="BL">Bloqueado</option>
                </select>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); limpiarFormulario(); }}
                  style={{ padding: '10px 20px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
