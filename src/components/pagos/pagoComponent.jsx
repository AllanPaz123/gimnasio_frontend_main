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
  Card,
  Divider,
  Container,
  Stack,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const Pago = () => {
  const [pagos, setPagos] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    id_membresia: '',
    monto: '',
    metodo_pago: 'Efectivo',
    notas: ''
  });
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPagos();
    cargarMembresias();
  }, []);

  const cargarPagos = async () => {
    try {
      const response = await api.get('/api/pagos/pagos/listar');
      console.log('Pagos cargados:', response.data);
      console.log('Primer pago:', response.data[0]);
      setPagos(response.data);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setError('Error al cargar pagos');
    }
  };

  const cargarMembresias = async () => {
    try {
      const response = await api.get('/api/pagos/membresias/listar');
      setMembresias(response.data);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
      setError('Error al cargar membresías');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleComprobanteChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setComprobanteFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobantePreview(reader.result);
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
      handleComprobanteChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleComprobanteChange(e.target.files[0]);
    }
  };

  const eliminarComprobantePreview = () => {
    setComprobanteFile(null);
    setComprobantePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formDataToSend = new FormData();
      
      // Agregar campos del pago (solo los que tienen valor válido)
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Agregar comprobante si existe
      if (comprobanteFile) {
        formDataToSend.append('comprobante', comprobanteFile);
      }

      if (pagoSeleccionado) {
        // Editar pago - enviar solo los datos sin comprobante
        await api.put(`/api/pagos/pagos/editar?id=${pagoSeleccionado.id}`, formData);
        
        // Si hay nuevo comprobante, subirlo por separado
        if (comprobanteFile) {
          const formDataComprobante = new FormData();
          formDataComprobante.append('comprobante', comprobanteFile);
          await api.post(`/api/pagos/pagos/comprobante?id=${pagoSeleccionado.id}`, formDataComprobante, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Crear nuevo pago con comprobante incluido
        await api.post('/api/pagos/pagos/guardar', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      cargarPagos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar pago:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al guardar pago');
      }
    }
  };

  const editarPago = (pago) => {
    setPagoSeleccionado(pago);
    setFormData({
      id_membresia: pago.id_membresia || '',
      monto: pago.monto || '',
      metodo_pago: pago.metodo_pago || 'Efectivo',
      notas: pago.notas || ''
    });
    
    if (pago.comprobante) {
      setComprobantePreview(`http://localhost:3000/${pago.comprobante}`);
    } else {
      setComprobantePreview(null);
    }
    setComprobanteFile(null);
    
    setMostrarModal(true);
  };

  const eliminarPago = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      try {
        await api.delete(`/api/pagos/pagos/eliminar?id=${id}`);
        cargarPagos();
      } catch (error) {
        console.error('Error al eliminar pago:', error);
        setError('Error al eliminar pago');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoSeleccionado(null);
    setFormData({
      id_membresia: '',
      monto: '',
      metodo_pago: 'Efectivo',
      notas: ''
    });
    setComprobanteFile(null);
    setComprobantePreview(null);
    setDragActive(false);
    setError('');
  };

  const getMetodoPagoColor = (metodo) => {
    const colores = {
      'efectivo': 'success',
      'tarjeta': 'primary',
      'transferencia': 'info',
      'cheque': 'secondary'
    };
    return colores[metodo] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Pagos
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Pago
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comprobante</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Referencia</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Membresía</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Método</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Procesado Por</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow 
                key={pago.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  {pago.comprobante ? (
                    <Avatar 
                      src={`http://localhost:3000/${pago.comprobante}`}
                      alt="Comprobante"
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                      <ReceiptIcon />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<ReceiptIcon />}
                    label={pago.referencia}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {pago.membresia?.cliente?.nombre} {pago.membresia?.cliente?.apellido}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {pago.membresia?.plan?.nombre_plan}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MoneyIcon />}
                    label={`$${pago.monto?.toLocaleString()}`}
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={pago.metodo_pago}
                    color={getMetodoPagoColor(pago.metodo_pago)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{pago.procesadoPor?.username || 'Sistema'}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarPago(pago)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarPago(pago.id_pago)}
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
              {pagoSeleccionado ? 'Editar Pago' : 'Nuevo Pago'}
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
              Información del Pago
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Membresía"
                  name="id_membresia"
                  value={formData.id_membresia}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Seleccione una membresía</MenuItem>
                  {membresias.map(membresia => (
                    <MenuItem key={membresia.id} value={membresia.id}>
                      {membresia.cliente?.nombre} {membresia.cliente?.apellido} - {membresia.plan?.nombre_plan}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Monto"
                  name="monto"
                  value={formData.monto}
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
                  select
                  required
                  label="Método de Pago"
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
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

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Comprobante de Pago
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
              onClick={() => document.getElementById('fileInputPago').click()}
            >
              <input
                id="fileInputPago"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              {comprobantePreview ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={comprobantePreview} 
                    alt="Comprobante" 
                    variant="rounded"
                    sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarComprobantePreview();
                    }}
                  >
                    Eliminar comprobante
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    Arrastra el comprobante aquí
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
            {pagoSeleccionado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pago;
