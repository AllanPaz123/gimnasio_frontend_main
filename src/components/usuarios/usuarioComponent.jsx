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
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  TablePagination,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AccountCircle as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    // Datos de usuario
    id_rol: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    username: '',
    password: '',
    estado: 'activo',
    // Datos de cliente
    cliente: {
      nombre: '',
      apellido: '',
      tipo_sangre: '',
      peso_actual: '',
      altura: '',
      condiciones_medicas: '',
      contacto_emergencia: '',
      telefono_emergencia: ''
    }
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/api/usuario/listar');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios');
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await api.get('/api/rol/listar');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setError('Error al cargar roles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      cliente: {
        ...formData.cliente,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (usuarioSeleccionado) {
        // Actualizar usuario (sin datos de cliente en esta request)
        const { cliente, password, ...datosUsuario } = formData;
        // Solo enviar password si fue modificado
        const dataToSend = password ? { ...datosUsuario, password } : datosUsuario;
        await api.put(`/api/usuario/actualizar?id=${usuarioSeleccionado.id_usuario}`, dataToSend);
      } else {
        // Crear nuevo usuario con cliente
        await api.post('/api/usuario/registro', formData);
      }
      
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al guardar usuario');
      }
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setFormData({
      id_rol: usuario.id_rol || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      fecha_nacimiento: usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '',
      genero: usuario.genero || '',
      username: usuario.username || '',
      password: '', // No prellenar password por seguridad
      estado: usuario.estado || 'activo',
      cliente: {
        nombre: usuario.Cliente?.nombre || '',
        apellido: usuario.Cliente?.apellido || '',
        tipo_sangre: usuario.Cliente?.tipo_sangre || '',
        peso_actual: usuario.Cliente?.peso_actual || '',
        altura: usuario.Cliente?.altura || '',
        condiciones_medicas: usuario.Cliente?.condiciones_medicas || '',
        contacto_emergencia: usuario.Cliente?.contacto_emergencia || '',
        telefono_emergencia: usuario.Cliente?.telefono_emergencia || ''
      }
    });
    setMostrarModal(true);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
      try {
        await api.delete(`/api/usuario/eliminar?id=${id}`);
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar usuario');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
    setFormData({
      id_rol: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
      username: '',
      password: '',
      estado: 'activo',
      cliente: {
        nombre: '',
        apellido: '',
        tipo_sangre: '',
        peso_actual: '',
        altura: '',
        condiciones_medicas: '',
        contacto_emergencia: '',
        telefono_emergencia: ''
      }
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'activo': 'success',
      'inactivo': 'error',
      'suspendido': 'warning'
    };
    return colores[estado] || 'default';
  };

  // Función para filtrar usuarios según la búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const clienteNombre = usuario.Cliente 
      ? `${usuario.Cliente.nombre || ''} ${usuario.Cliente.apellido || ''}`.toLowerCase()
      : '';
    const rolNombre = roles.find(r => r.id_rol === usuario.id_rol)?.nombre?.toLowerCase() || '';
    
    return (
      usuario.username?.toLowerCase().includes(terminoBusqueda) ||
      clienteNombre.includes(terminoBusqueda) ||
      usuario.email?.toLowerCase().includes(terminoBusqueda) ||
      usuario.telefono?.includes(terminoBusqueda) ||
      rolNombre.includes(terminoBusqueda) ||
      usuario.estado?.toLowerCase().includes(terminoBusqueda) ||
      usuario.id_usuario?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular los usuarios a mostrar en la página actual
  const usuariosPaginados = usuariosFiltrados.slice(
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
            <UserIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Usuarios
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Usuario
          </Button>
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
          placeholder="Buscar por usuario, cliente, email, teléfono, rol, estado o ID..."
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Registro</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosPaginados.length > 0 ? (
              usuariosPaginados.map((usuario) => (
              <TableRow 
                key={usuario.id_usuario}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <UserIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {usuario.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {usuario.id_usuario}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {usuario.Cliente ? (
                    <Typography variant="body2">
                      {usuario.Cliente.nombre} {usuario.Cliente.apellido}
                    </Typography>
                  ) : (
                    <Chip label="Sin cliente" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<EmailIcon />}
                    label={usuario.email}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<PhoneIcon />}
                    label={usuario.telefono || 'N/A'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={roles.find(r => r.id_rol === usuario.id_rol)?.nombre || 'N/A'}
                    size="small"
                    color="info"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.estado}
                    color={getEstadoColor(usuario.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarUsuario(usuario)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarUsuario(usuario.id_usuario)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {busqueda ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={usuariosFiltrados.length}
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
              {usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
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
            {/* Datos de Usuario */}
            <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
              Información de la Cuenta
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre de Usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={usuarioSeleccionado !== null}
                  helperText={usuarioSeleccionado ? "No se puede modificar" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required={!usuarioSeleccionado}
                  type="password"
                  label="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  helperText={usuarioSeleccionado ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Género"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Rol"
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione un rol</MenuItem>
                  {roles.map(rol => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </MenuItem>
                  ))}
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
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="suspendido">Suspendido</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {!usuarioSeleccionado && (
              <>
                <Divider sx={{ my: 3 }} />

                {/* Datos de Cliente */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Información del Cliente
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Nombre"
                      name="nombre"
                      value={formData.cliente.nombre}
                      onChange={handleClienteChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Apellido"
                      name="apellido"
                      value={formData.cliente.apellido}
                      onChange={handleClienteChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tipo de Sangre"
                      name="tipo_sangre"
                      value={formData.cliente.tipo_sangre}
                      onChange={handleClienteChange}
                      placeholder="A+, O-, etc."
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Peso (kg)"
                      name="peso_actual"
                      value={formData.cliente.peso_actual}
                      onChange={handleClienteChange}
                      inputProps={{ step: "0.01" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Altura (m)"
                      name="altura"
                      value={formData.cliente.altura}
                      onChange={handleClienteChange}
                      inputProps={{ step: "0.01" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Condiciones Médicas"
                      name="condiciones_medicas"
                      value={formData.cliente.condiciones_medicas}
                      onChange={handleClienteChange}
                      placeholder="Alergias, enfermedades, lesiones, etc."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contacto de Emergencia"
                      name="contacto_emergencia"
                      value={formData.cliente.contacto_emergencia}
                      onChange={handleClienteChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono de Emergencia"
                      name="telefono_emergencia"
                      value={formData.cliente.telefono_emergencia}
                      onChange={handleClienteChange}
                    />
                  </Grid>
                </Grid>
              </>
            )}
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
            {usuarioSeleccionado ? 'Actualizar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Usuario;
