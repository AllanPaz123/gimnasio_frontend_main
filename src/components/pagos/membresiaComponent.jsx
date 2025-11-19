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
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CardMembership as MembershipIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const Membresia = () => {
  const [membresias, setMembresias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_plan: '',
    fecha_inicio: '',
    fecha_vencimiento: '',
    estado: 'Activa',
    monto_pagado: '',
    descuento_aplicado: '',
    notas: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMembresias();
    cargarClientes();
    cargarPlanes();
  }, []);

  const cargarMembresias = async () => {
    try {
      const response = await api.get('/api/pagos/membresias/listar');
      setMembresias(response.data);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
      setError('Error al cargar membresías');
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await api.get('/api/cliente/listar');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar clientes');
    }
  };

  const cargarPlanes = async () => {
    try {
      const response = await api.get('/api/pagos/planes/listar');
      setPlanes(response.data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      setError('Error al cargar planes');
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
      if (membresiaSeleccionada) {
        await api.put(`/api/pagos/membresias/editar?id=${membresiaSeleccionada.id}`, formData);
      } else {
        await api.post('/api/pagos/membresias/guardar', formData);
      }
      
      cargarMembresias();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar membresía:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al guardar membresía');
      }
    }
  };

  const editarMembresia = (membresia) => {
    setMembresiaSeleccionada(membresia);
    setFormData({
      id_cliente: membresia.id_cliente || '',
      id_plan: membresia.id_plan || '',
      fecha_inicio: membresia.fecha_inicio ? membresia.fecha_inicio.split('T')[0] : '',
      fecha_vencimiento: membresia.fecha_vencimiento ? membresia.fecha_vencimiento.split('T')[0] : '',
      estado: membresia.estado || 'Activa',
      monto_pagado: membresia.monto_pagado || '',
      descuento_aplicado: membresia.descuento_aplicado || '',
      notas: membresia.notas || ''
    });
    setMostrarModal(true);
  };

  const eliminarMembresia = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta membresía?')) {
      try {
        await api.delete(`/api/pagos/membresias/eliminar?id=${id}`);
        cargarMembresias();
      } catch (error) {
        console.error('Error al eliminar membresía:', error);
        setError('Error al eliminar membresía');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMembresiaSeleccionada(null);
    setFormData({
      id_cliente: '',
      id_plan: '',
      fecha_inicio: '',
      fecha_vencimiento: '',
      estado: 'Activa',
      monto_pagado: '',
      descuento_aplicado: '',
      notas: ''
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Activa': 'success',
      'Vencida': 'error',
      'suspendida': 'warning',
      'Cancelada': 'default'
    };
    return colores[estado] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <MembershipIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Membresías
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nueva Membresía
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Plan</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Inicio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Vencimiento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descuento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Final</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membresias.map((membresia) => (
              <TableRow 
                key={membresia.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {membresia.cliente?.nombre} {membresia.cliente?.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {membresia.cliente?.id_cliente}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {membresia.plan?.nombre_plan}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {membresia.plan?.duracion_dias} días
                  </Typography>
                </TableCell>
                <TableCell>
                  {membresia.fecha_inicio ? new Date(membresia.fecha_inicio).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {membresia.fecha_vencimiento ? new Date(membresia.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MoneyIcon />}
                    label={`$${membresia.monto_pagado?.toLocaleString()}`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {membresia.descuento_aplicado ? `${membresia.descuento_aplicado}%` : 'Sin descuento'}
                </TableCell>
                <TableCell>
                  {(() => {
                    const monto = Number(membresia.monto_pagado) || 0;
                    const descuento = Number(membresia.descuento_aplicado) || 0;
                    const montoFinal = descuento > 0 ? monto - (monto * descuento / 100) : monto;
                    return (
                      <Chip 
                        icon={<MoneyIcon />}
                        label={`$${montoFinal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        color="primary"
                        size="small"
                      />
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={membresia.estado}
                    color={getEstadoColor(membresia.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarMembresia(membresia)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarMembresia(membresia.id)}
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
              {membresiaSeleccionada ? 'Editar Membresía' : 'Nueva Membresía'}
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
              Información de la Membresía
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Cliente"
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione un cliente</MenuItem>
                  {clientes.map(cliente => (
                    <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre} {cliente.apellido}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Plan de Membresía"
                  name="id_plan"
                  value={formData.id_plan}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione un plan</MenuItem>
                  {planes.map(plan => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.nombre_plan} - {plan.duracion_dias} días
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Inicio"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Vencimiento"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto Pagado"
                  name="monto_pagado"
                  value={formData.monto_pagado}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01" }}
                  InputProps={{
                    startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Descuento Aplicado (%)"
                  name="descuento_aplicado"
                  value={formData.descuento_aplicado}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 100, step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto Final (Informativo)"
                  value={(() => {
                    const monto = Number(formData.monto_pagado) || 0;
                    const descuento = Number(formData.descuento_aplicado) || 0;
                    const montoFinal = descuento > 0 ? monto - (monto * descuento / 100) : monto;
                    return `$${montoFinal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  })()}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: 'success.main'
                    }
                  }}
                  helperText="Este es el monto que se aplicará en el pago"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Activa">Activa</MenuItem>
                  <MenuItem value="Vencida">Vencida</MenuItem>
                  <MenuItem value="suspendida">Suspendida</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
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
            {membresiaSeleccionada ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Membresia;
