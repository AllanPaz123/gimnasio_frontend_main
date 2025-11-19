import React, { useState, useEffect } from 'react';
import api from '../api/http';
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
  CardContent,
  Divider,
  Container,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    identidad: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    salario: '',
    estado: 'AC',
    cargoId: '',
    telefonos: [{ numero: '' }],
    direcciones: [{ direccion: '', latitud: '', longitud: '' }]
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEmpleados();
    cargarCargos();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/empleados/listar');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setError('Error al cargar empleados');
    }
  };

  const cargarCargos = async () => {
    try {
      const response = await api.get('/api/cargos/listar');
      setCargos(response.data);
    } catch (error) {
      console.error('Error al cargar cargos:', error);
      setError('Error al cargar cargos');
    }
  };

  // esa e quiere decir event 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTelefonoChange = (index, value) => {
    const nuevosTelefonos = [...formData.telefonos];
    nuevosTelefonos[index].numero = value;
    setFormData({ ...formData, telefonos: nuevosTelefonos });
  };

  const agregarTelefono = () => {
    setFormData({
      ...formData,
      telefonos: [...formData.telefonos, { numero: '' }]
    });
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = formData.telefonos.filter((_, i) => i !== index);
    setFormData({ ...formData, telefonos: nuevosTelefonos });
  };

  const handleDireccionChange = (index, field, value) => {
    const nuevasDirecciones = [...formData.direcciones];
    nuevasDirecciones[index][field] = value;
    setFormData({ ...formData, direcciones: nuevasDirecciones });
  };

  const agregarDireccion = () => {
    setFormData({
      ...formData,
      direcciones: [...formData.direcciones, { direccion: '', latitud: '', longitud: '' }]
    });
  };

  const eliminarDireccion = (index) => {
    const nuevasDirecciones = formData.direcciones.filter((_, i) => i !== index);
    setFormData({ ...formData, direcciones: nuevasDirecciones });
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
      const datosEmpleado = {
        identidad: formData.identidad,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        fechaNacimiento: formData.fechaNacimiento,
        salario: parseFloat(formData.salario),
        estado: formData.estado,
        cargoId: parseInt(formData.cargoId),
        telefonos: formData.telefonos.filter(t => t.numero && t.numero.trim() !== ''),
        direcciones: formData.direcciones.filter(d => d.direccion && d.direccion.trim() !== '')
      };

      let empleadoId;
      if (empleadoSeleccionado) {
        await api.put(`/api/empleados/editar?id=${empleadoSeleccionado.id}`, datosEmpleado);
        empleadoId = empleadoSeleccionado.id;
      } else {
        const response = await api.post('/api/empleados/guardar', datosEmpleado);
        // Asumiendo que el backend devuelve el id del empleado creado
        // Si no, necesitarás ajustar esto
        const empleadosActualizados = await api.get('/api/empleados/listar');
        empleadoId = empleadosActualizados.data[empleadosActualizados.data.length - 1].id;
      }

      // Subir imagen si se seleccionó una
      if (imagenFile && empleadoId) {
        try {
          const formDataImagen = new FormData();
          formDataImagen.append('imagen', imagenFile);
          
          console.log('Subiendo imagen para empleado ID:', empleadoId);
          console.log('Tiene imágenes existentes:', empleadoSeleccionado?.empleadoImagenes?.length > 0);
          
          if (empleadoSeleccionado && empleadoSeleccionado.empleadoImagenes?.length > 0) {
            // Actualizar imagen existente
            console.log('Actualizando imagen existente...');
            const response = await api.put(`/api/empleados/imagenes?id=${empleadoId}`, formDataImagen, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Respuesta actualización imagen:', response.data);
          } else {
            // Crear nueva imagen
            console.log('Creando nueva imagen...');
            const response = await api.post(`/api/empleados/imagenes?id=${empleadoId}`, formDataImagen, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Respuesta creación imagen:', response.data);
          }
        } catch (errorImagen) {
          console.error('Error completo al subir imagen:', errorImagen);
          console.error('Respuesta del servidor:', errorImagen.response?.data);
          // Continuar aunque falle la imagen
          setError('Empleado guardado, pero hubo un error al subir la imagen: ' + 
            (errorImagen.response?.data?.msj || errorImagen.response?.data?.error || errorImagen.message || 'Error desconocido'));
        }
      }
      
      cargarEmpleados();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      
      // Manejar errores de validación del backend
      if (error.response?.data?.data && Array.isArray(error.response.data.data)) {
        const erroresFormateados = error.response.data.data.map(e => 
          `${e.atributo}: ${e.msj}`
        ).join('\n');
        setError(`${error.response.data.msj}:\n${erroresFormateados}`);
      } else if (error.response?.data?.msj) {
        setError(error.response.data.msj);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al guardar empleado');
      }
    }
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setFormData({
      identidad: empleado.identidad || '',
      primerNombre: empleado.primerNombre || '',
      segundoNombre: empleado.segundoNombre || '',
      primerApellido: empleado.primerApellido || '',
      segundoApellido: empleado.segundoApellido || '',
      fechaNacimiento: empleado.fechaNacimiento ? empleado.fechaNacimiento.split('T')[0] : '',
      salario: empleado.salario || '',
      estado: empleado.estado || 'AC',
      cargoId: empleado.cargoId || '',
      telefonos: empleado.empleadoTelefonos?.length > 0 
        ? empleado.empleadoTelefonos.map(t => ({ numero: t.numero || '' }))
        : [{ numero: '' }],
      direcciones: empleado.empleadoDireccions?.length > 0 
        ? empleado.empleadoDireccions.map(d => ({ 
            direccion: d.direccion || '', 
            latitud: d.latitud || '', 
            longitud: d.longitud || '' 
          }))
        : [{ direccion: '', latitud: '', longitud: '' }]
    });
    
    // Cargar imagen existente si hay
    if (empleado.empleadoImagenes && empleado.empleadoImagenes.length > 0) {
      setImagenPreview(`http://localhost:3000/api/imagenes/empleados/${empleado.empleadoImagenes[0].imagen}`);
    } else {
      setImagenPreview(null);
    }
    setImagenFile(null);
    
    setMostrarModal(true);
  };

  const eliminarEmpleado = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await api.delete(`/api/empleados/eliminar?id=${id}`);
        cargarEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        setError('Error al eliminar empleado');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEmpleadoSeleccionado(null);
    setFormData({
      identidad: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      salario: '',
      estado: 'AC',
      cargoId: '',
      telefonos: [{ numero: '' }],
      direcciones: [{ direccion: '', latitud: '', longitud: '' }]
    });
    setImagenFile(null);
    setImagenPreview(null);
    setDragActive(false);
    setError('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Empleados
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Empleado
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Imagen</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Identidad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Completo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cargo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Salario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow 
                key={empleado.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  {empleado.empleadoImagenes && empleado.empleadoImagenes.length > 0 ? (
                    <Avatar 
                      src={`http://localhost:3000/api/imagenes/empleados/${empleado.empleadoImagenes[0].imagen}`}
                      alt={`${empleado.primerNombre} ${empleado.primerApellido}`}
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 56, height: 56 }}>
                      {empleado.primerNombre?.charAt(0)}{empleado.primerApellido?.charAt(0)}
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{empleado.identidad || 'N/A'}</TableCell>
                <TableCell>
                  {`${empleado.primerNombre} ${empleado.segundoNombre || ''} ${empleado.primerApellido} ${empleado.segundoApellido || ''}`.trim()}
                </TableCell>
                <TableCell>{empleado.cargo?.nombre || 'N/A'}</TableCell>
                <TableCell>${empleado.salario?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={empleado.estado === 'AC' ? 'Activo' : empleado.estado === 'IN' ? 'Inactivo' : 'Bloqueado'}
                    color={empleado.estado === 'AC' ? 'success' : empleado.estado === 'IN' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarEmpleado(empleado)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarEmpleado(empleado.id)}
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
              {empleadoSeleccionado ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                  label="Identidad"
                  name="identidad"
                  value={formData.identidad}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 13 }}
                  placeholder="0000000000000"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Primer Nombre"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Segundo Nombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Primer Apellido"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Segundo Apellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Salario"
                  name="salario"
                  value={formData.salario}
                  onChange={handleInputChange}
                  inputProps={{ step: "0.01" }}
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
                  <MenuItem value="AC">Activo</MenuItem>
                  <MenuItem value="IN">Inactivo</MenuItem>
                  <MenuItem value="BL">Bloqueado</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Cargo"
                  name="cargoId"
                  value={formData.cargoId}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione un cargo</MenuItem>
                  {cargos.map(cargo => (
                    <MenuItem key={cargo.id} value={cargo.id}>
                      {cargo.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Imagen del Empleado
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
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
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
                    PNG, JPG o JPEG (máx. 20MB)
                  </Typography>
                </Box>
              )}
            </Card>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 1 }} /> Teléfonos
            </Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              {formData.telefonos.map((tel, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Teléfono ${index + 1}`}
                    value={tel.numero}
                    onChange={(e) => handleTelefonoChange(index, e.target.value)}
                    placeholder="Número de teléfono"
                  />
                  {formData.telefonos.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => eliminarTelefono(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={agregarTelefono}
              >
                Agregar Teléfono
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1 }} /> Direcciones
            </Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              {formData.direcciones.map((dir, index) => (
                <Card key={index} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label={`Dirección ${index + 1}`}
                      value={dir.direccion}
                      onChange={(e) => handleDireccionChange(index, 'direccion', e.target.value)}
                      placeholder="Dirección completa"
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Latitud"
                          value={dir.latitud}
                          onChange={(e) => handleDireccionChange(index, 'latitud', e.target.value)}
                          placeholder="Latitud"
                          inputProps={{ step: "any" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Longitud"
                          value={dir.longitud}
                          onChange={(e) => handleDireccionChange(index, 'longitud', e.target.value)}
                          placeholder="Longitud"
                          inputProps={{ step: "any" }}
                        />
                      </Grid>
                    </Grid>
                    {formData.direcciones.length > 1 && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => eliminarDireccion(index)}
                        fullWidth
                      >
                        Eliminar Dirección
                      </Button>
                    )}
                  </Stack>
                </Card>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={agregarDireccion}
              >
                Agregar Dirección
              </Button>
            </Stack>
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
            {empleadoSeleccionado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Empleados;
