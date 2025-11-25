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
  Container,
  Stack,
  Avatar,
  TablePagination,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocalHospital as MedicalIcon,
  FitnessCenter as FitnessIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipo_sangre: '',
    peso_actual: '',
    altura: '',
    condiciones_medicas: '',
    contacto_emergencia: '',
    telefono_emergencia: ''
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/api/usuario/listar');
      // Filtrar solo los usuarios que tienen información de cliente
      const clientesData = response.data
        .filter(user => user.Cliente)
        .map(user => ({
          ...user.Cliente,
          usuario: user
        }));
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar clientes');
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
      await api.put(`/api/cliente/actualizar?id=${clienteSeleccionado.id_cliente}`, formData);
      cargarClientes();
      cerrarModal();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al actualizar cliente');
      }
    }
  };

  const editarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData({
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      tipo_sangre: cliente.tipo_sangre || '',
      peso_actual: cliente.peso_actual || '',
      altura: cliente.altura || '',
      condiciones_medicas: cliente.condiciones_medicas || '',
      contacto_emergencia: cliente.contacto_emergencia || '',
      telefono_emergencia: cliente.telefono_emergencia || ''
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteSeleccionado(null);
    setFormData({
      nombre: '',
      apellido: '',
      tipo_sangre: '',
      peso_actual: '',
      altura: '',
      condiciones_medicas: '',
      contacto_emergencia: '',
      telefono_emergencia: ''
    });
    setError('');
  };

  // Función para filtrar clientes según la búsqueda
  const clientesFiltrados = clientes.filter((cliente) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const nombreCompleto = `${cliente.nombre || ''} ${cliente.apellido || ''}`.toLowerCase();
    
    return (
      nombreCompleto.includes(terminoBusqueda) ||
      cliente.usuario?.username?.toLowerCase().includes(terminoBusqueda) ||
      cliente.usuario?.email?.toLowerCase().includes(terminoBusqueda) ||
      cliente.usuario?.telefono?.includes(terminoBusqueda) ||
      cliente.tipo_sangre?.toLowerCase().includes(terminoBusqueda) ||
      cliente.id_cliente?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular los clientes a mostrar en la página actual
  const clientesPaginados = clientesFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar cambio en el campo de búsqueda
  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Clientes
          </Typography>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, usuario, email, teléfono, tipo de sangre o ID..."
          value={busqueda}
          onChange={handleBusquedaChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Sangre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Peso/Altura</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientesPaginados.length > 0 ? (
              clientesPaginados.map((cliente) => (
              <TableRow 
                key={cliente.id_cliente}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {cliente.nombre} {cliente.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {cliente.id_cliente}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.usuario?.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.usuario?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<PhoneIcon />}
                    label={cliente.usuario?.telefono || 'N/A'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MedicalIcon />}
                    label={cliente.tipo_sangre || 'N/A'}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip 
                      icon={<FitnessIcon />}
                      label={cliente.peso_actual ? `${cliente.peso_actual} kg` : 'N/A'}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                    <Chip 
                      label={cliente.altura ? `${cliente.altura} m` : 'N/A'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={cliente.usuario?.estado || 'activo'}
                    color={cliente.usuario?.estado === 'activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarCliente(cliente)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {busqueda ? 'No se encontraron clientes que coincidan con la búsqueda' : 'No hay clientes registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={clientesFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
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
              Editar Cliente
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
              Información Personal
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tipo de Sangre"
                  name="tipo_sangre"
                  value={formData.tipo_sangre}
                  onChange={handleInputChange}
                  placeholder="A+, O-, etc."
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Peso (kg)"
                  name="peso_actual"
                  value={formData.peso_actual}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Altura (m)"
                  name="altura"
                  value={formData.altura}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Condiciones Médicas"
                  name="condiciones_medicas"
                  value={formData.condiciones_medicas}
                  onChange={handleInputChange}
                  placeholder="Alergias, enfermedades crónicas, lesiones, etc."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contacto de Emergencia"
                  name="contacto_emergencia"
                  value={formData.contacto_emergencia}
                  onChange={handleInputChange}
                  placeholder="Nombre del contacto"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono de Emergencia"
                  name="telefono_emergencia"
                  value={formData.telefono_emergencia}
                  onChange={handleInputChange}
                  placeholder="Número de contacto"
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
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cliente;