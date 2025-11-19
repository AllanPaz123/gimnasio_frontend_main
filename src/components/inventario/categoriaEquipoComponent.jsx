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
  Alert,
  Typography,
  Grid,
  Container,
  Stack,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const CategoriaEquipo = () => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (categoriaSeleccionada) {
        await api.put(`/api/inventario/categoria/editar?id=${categoriaSeleccionada.id}`, formData);
      } else {
        await api.post('/api/inventario/categoria/guardar', formData);
      }
      
      cargarCategorias();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar categoría');
      }
    }
  };

  const editarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFormData({
      nombre_categoria: categoria.nombre_categoria || '',
      descripcion: categoria.descripcion || ''
    });
    setMostrarModal(true);
  };

  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/api/inventario/categoria/eliminar?id=${id}`);
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        setError('Error al eliminar categoría');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCategoriaSeleccionada(null);
    setFormData({
      nombre_categoria: '',
      descripcion: ''
    });
    setError('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Categorías de Equipos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nueva Categoría
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Categoría</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow 
                key={categoria.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Chip label={categoria.id} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {categoria.nombre_categoria}
                  </Typography>
                </TableCell>
                <TableCell>{categoria.descripcion || 'Sin descripción'}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarCategoria(categoria)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarCategoria(categoria.id)}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {categoriaSeleccionada ? 'Editar Categoría' : 'Nueva Categoría'}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nombre de Categoría"
                  name="nombre_categoria"
                  value={formData.nombre_categoria}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
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
            {categoriaSeleccionada ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoriaEquipo;
