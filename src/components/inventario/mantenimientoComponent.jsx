import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Typography,
  Grid,
  MenuItem,
  Container,
  Stack,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Build as BuildIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    tipo_mantenimiento: 'preventivo',
    fecha_programada: '',
    fecha_realizada: '',
    descripcion_trabajo: '',
    tecnico_responsable: '',
    costo: '',
    estado: 'Pendiente',
    proximo_mantenimiento: '',
    notas: '',
    id_equipo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMantenimientos();
    cargarEquipos();
  }, []);

  const cargarMantenimientos = async () => {
    try {
      const response = await api.get('/api/inventario/mantenimiento/listar');
      setMantenimientos(response.data);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
      setError('Error al cargar mantenimientos');
    }
  };

  const cargarEquipos = async () => {
    try {
      const response = await api.get('/api/inventario/equipo/listar');
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setError('Error al cargar equipos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mantenimientoSeleccionado) {
        await api.put(`/api/inventario/mantenimiento/editar?id=${mantenimientoSeleccionado.id}`, formData);
      } else {
        await api.post('/api/inventario/mantenimiento/guardar', formData);
      }
      
      cargarMantenimientos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar mantenimiento');
      }
    }
  };

  const editarMantenimiento = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setFormData({
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'preventivo',
      fecha_programada: mantenimiento.fecha_programada ? mantenimiento.fecha_programada.split('T')[0] : '',
      fecha_realizada: mantenimiento.fecha_realizada ? mantenimiento.fecha_realizada.split('T')[0] : '',
      descripcion_trabajo: mantenimiento.descripcion_trabajo || '',
      tecnico_responsable: mantenimiento.tecnico_responsable || '',
      costo: mantenimiento.costo || '',
      estado: mantenimiento.estado || 'Pendiente',
      proximo_mantenimiento: mantenimiento.proximo_mantenimiento ? mantenimiento.proximo_mantenimiento.split('T')[0] : '',
      notas: mantenimiento.notas || '',
      id_equipo: mantenimiento.id_equipo || ''
    });
    setMostrarModal(true);
  };

  const eliminarMantenimiento = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      try {
        await api.delete(`/api/inventario/mantenimiento/eliminar?id=${id}`);
        cargarMantenimientos();
      } catch (error) {
        console.error('Error al eliminar mantenimiento:', error);
        setError('Error al eliminar mantenimiento');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMantenimientoSeleccionado(null);
    setFormData({
      tipo_mantenimiento: 'preventivo',
      fecha_programada: '',
      fecha_realizada: '',
      descripcion_trabajo: '',
      tecnico_responsable: '',
      costo: '',
      estado: 'Pendiente',
      proximo_mantenimiento: '',
      notas: '',
      id_equipo: ''
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'warning',
      'En progreso': 'info',
      'Completado': 'success',
      'Cancelado': 'error'
    };
    return colores[estado] || 'default';
  };

  const getTipoColor = (tipo) => {
    return tipo === 'preventivo' ? 'primary' : 'secondary';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <BuildIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Mantenimientos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Mantenimiento
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Equipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Técnico</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Programada</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Realizada</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mantenimientos.map((mantenimiento) => (
              <TableRow 
                key={mantenimiento.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {mantenimiento.equipo?.nombre_equipo || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mantenimiento.equipo?.numero_serie}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={mantenimiento.tipo_mantenimiento}
                    color={getTipoColor(mantenimiento.tipo_mantenimiento)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{mantenimiento.tecnico_responsable}</TableCell>
                <TableCell>
                  {mantenimiento.fecha_programada ? new Date(mantenimiento.fecha_programada).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {mantenimiento.fecha_realizada ? new Date(mantenimiento.fecha_realizada).toLocaleDateString() : 'Pendiente'}
                </TableCell>
                <TableCell>${mantenimiento.costo?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={mantenimiento.estado}
                    color={getEstadoColor(mantenimiento.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarMantenimiento(mantenimiento)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarMantenimiento(mantenimiento.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={mostrarModal} 
        onClose={cerrarModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {mantenimientoSeleccionado ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
            </Typography>
            <IconButton onClick={cerrarModal} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {error}
              </Typography>
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
              Información del Mantenimiento
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Equipo"
                  name="id_equipo"
                  value={formData.id_equipo}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione un equipo</MenuItem>
                  {equipos.map(equipo => (
                    <MenuItem key={equipo.id} value={equipo.id}>
                      {equipo.nombre_equipo} - {equipo.numero_serie}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Tipo de Mantenimiento"
                  name="tipo_mantenimiento"
                  value={formData.tipo_mantenimiento}
                  onChange={handleInputChange}
                >
                  <MenuItem value="preventivo">Preventivo</MenuItem>
                  <MenuItem value="correctivo">Correctivo</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="En progreso">En progreso</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Programada"
                  name="fecha_programada"
                  value={formData.fecha_programada}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Realizada"
                  name="fecha_realizada"
                  value={formData.fecha_realizada}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Próximo Mantenimiento"
                  name="proximo_mantenimiento"
                  value={formData.proximo_mantenimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Costo"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Técnico Responsable"
                  name="tecnico_responsable"
                  value={formData.tecnico_responsable}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Descripción del Trabajo"
                  name="descripcion_trabajo"
                  value={formData.descripcion_trabajo}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notas Adicionales"
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={cerrarModal}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            {mantenimientoSeleccionado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Mantenimiento;
