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
  Avatar,
  Chip,
  Alert,
  Typography,
  Grid,
  MenuItem,
  Card,
  Divider,
  Container,
  Stack,
  TablePagination,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  FitnessCenter as FitnessCenterIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import VistaEquiposComponent from './equiposComponents/vistaEquiposComponent';

const Equipo = () => {
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    descripcion: '',
    fecha_compra: '',
    costo: '',
    ubicacion: '',
    estado: 'Excelente',
    id_categoria: null
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarEquipos();
    cargarCategorias();
  }, []);

  const cargarEquipos = async () => {
    try {
      const response = await api.get('/api/inventario/equipo/listar');
      console.log('Equipos cargados:', response.data);
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setError('Error al cargar equipos');
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/api/inventario/categoria/listar');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar categorías');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convertir id_categoria a número
    if (name === 'id_categoria') {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagenChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor selecciona un archivo de imagen válido');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImagenChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImagenChange(e.target.files[0]);
    }
  };

  const eliminarImagenPreview = () => {
    setImagenFile(null);
    setImagenPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validar que la categoría esté seleccionada
      if (!formData.id_categoria) {
        setError('Debe seleccionar una categoría');
        return;
      }

      const formDataToSend = new FormData();
      
      // Agregar campos del equipo (solo los que tienen valor válido)
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        // Solo agregar si el valor no es vacío, null o undefined
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Agregar imagen si existe
      if (imagenFile) {
        formDataToSend.append('imagen', imagenFile);
      }

      // Debug: ver qué se está enviando
      console.log('FormData a enviar:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }

      if (equipoSeleccionado) {
        // Editar equipo - enviar solo los datos sin imagen
        await api.put(`/api/inventario/equipo/editar?id=${equipoSeleccionado.id}`, formData);
        
        // Si hay nueva imagen, subirla por separado
        if (imagenFile) {
          const formDataImagen = new FormData();
          formDataImagen.append('imagen', imagenFile);
          await api.post(`/api/inventario/equipo/imagen?id=${equipoSeleccionado.id}`, formDataImagen, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Crear nuevo equipo con imagen incluida
        await api.post('/api/inventario/equipo/guardar', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      cargarEquipos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar equipo');
      }
    }
  };

  const editarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setFormData({
      nombre_equipo: equipo.nombre_equipo || '',
      marca: equipo.marca || '',
      modelo: equipo.modelo || '',
      numero_serie: equipo.numero_serie || '',
      descripcion: equipo.descripcion || '',
      fecha_compra: equipo.fecha_compra ? equipo.fecha_compra.split('T')[0] : '',
      costo: equipo.costo || '',
      ubicacion: equipo.ubicacion || '',
      estado: equipo.estado || 'Excelente',
      id_categoria: equipo.id_categoria || ''
    });
    
    if (equipo.foto) {
      setImagenPreview(`http://localhost:3000/${equipo.foto}`);
    } else {
      setImagenPreview(null);
    }
    setImagenFile(null);
    
    setMostrarModal(true);
  };

  const eliminarEquipo = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
      try {
        await api.delete(`/api/inventario/equipo/eliminar?id=${id}`);
        cargarEquipos();
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        setError('Error al eliminar equipo');
      }
    }
  };


  const verDetallesEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarDetalles(true);
  };


  const cerrarModal = () => {
    setMostrarModal(false);
    setEquipoSeleccionado(null);
    setFormData({
      nombre_equipo: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      descripcion: '',
      fecha_compra: '',
      costo: '',
      ubicacion: '',
      estado: 'Excelente',
      id_categoria: ''
    });
    setImagenFile(null);
    setImagenPreview(null);
    setDragActive(false);
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Excelente': 'success',
      'Bueno': 'info',
      'Regular': 'warning',
      'En mantenimiento': 'secondary',
      'Fuera de servicio': 'error'
    };
    return colores[estado] || 'default';
  };

  // Función para filtrar equipos según la búsqueda
  const equiposFiltrados = equipos.filter((equipo) => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      equipo.nombre_equipo?.toLowerCase().includes(terminoBusqueda) ||
      equipo.marca?.toLowerCase().includes(terminoBusqueda) ||
      equipo.modelo?.toLowerCase().includes(terminoBusqueda) ||
      equipo.numero_serie?.toLowerCase().includes(terminoBusqueda) ||
      equipo.categoria_equipo?.nombre_categoria?.toLowerCase().includes(terminoBusqueda) ||
      equipo.ubicacion?.toLowerCase().includes(terminoBusqueda) ||
      equipo.estado?.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Calcular los equipos a mostrar en la página actual
  const equiposPaginados = equiposFiltrados.slice(
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
    setPage(0); // Resetear a la primera página al buscar
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <FitnessCenterIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Equipos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Equipo
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
          placeholder="Buscar por nombre, marca, modelo, serie, categoría, ubicación o estado..."
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Imagen</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca/Modelo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Serie</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ubicación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equiposPaginados.length > 0 ? (
              equiposPaginados.map((equipo) => (
              <TableRow 
                key={equipo.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  {equipo.foto ? (
                    <Avatar 
                      src={`http://localhost:3000/${equipo.foto}`}
                      alt={equipo.nombre_equipo}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                      <FitnessCenterIcon />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {equipo.nombre_equipo}
                  </Typography>
                </TableCell>
                <TableCell>{equipo.marca} / {equipo.modelo}</TableCell>
                <TableCell>{equipo.numero_serie}</TableCell>
                <TableCell>{equipo.categoria_equipo?.nombre_categoria || 'N/A'}</TableCell>
                <TableCell>{equipo.ubicacion}</TableCell>
                <TableCell>L {equipo.costo?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Chip 
                    label={equipo.estado}
                    color={getEstadoColor(equipo.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                  color="primary"
                  onClick={() => verDetallesEquipo(equipo)}
                  size="small"
                  >
                   <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    color="primary"
                    onClick={() => editarEquipo(equipo)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarEquipo(equipo.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {busqueda ? 'No se encontraron equipos que coincidan con la búsqueda' : 'No hay equipos registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={equiposFiltrados.length}
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
              {equipoSeleccionado ? 'Editar Equipo' : 'Nuevo Equipo'}
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
              Información del Equipo
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Equipo"
                  name="nombre_equipo"
                  value={formData.nombre_equipo}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Número de Serie"
                  name="numero_serie"
                  value={formData.numero_serie}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Compra"
                  name="fecha_compra"
                  value={formData.fecha_compra}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Ubicación"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                />
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
                  <MenuItem value="Excelente">Excelente</MenuItem>
                  <MenuItem value="Bueno">Bueno</MenuItem>
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="En mantenimiento">En mantenimiento</MenuItem>
                  <MenuItem value="Fuera de servicio">Fuera de servicio</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Categoría"
                  name="id_categoria"
                  value={formData.id_categoria || ''}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione una categoría</MenuItem>
                  {categorias.map(categoria => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre_categoria}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Imagen del Equipo
            </Typography>
            
            <Card 
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                bgcolor: dragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInputEquipo').click()}
            >
              <input
                id="fileInputEquipo"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              {imagenPreview ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={imagenPreview} 
                    alt="Preview" 
                    variant="rounded"
                    sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarImagenPreview();
                    }}
                  >
                    Eliminar imagen
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    Arrastra la imagen aquí
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    o haz clic para seleccionar un archivo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG o JPEG
                  </Typography>
                </Box>
              )}
            </Card>
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
            {equipoSeleccionado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Vista de Detalles del Equipo */}
      <VistaEquiposComponent 
        open={mostrarDetalles}
        onClose={() => setMostrarDetalles(false)}
        equipoDetalle={equipoSeleccionado}
      />
    </Container>
  );
};

export default Equipo;
