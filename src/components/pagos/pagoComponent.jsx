import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import VistaPagosComponent from './pagosComponents/vistaPagosComponent';
import ModalComponent from './pagosComponents/modalComponent';
import {
  Box,
  Button,
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
  Container,
  Stack,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const Pago = () => {
  const [pagos, setPagos] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [formData, setFormData] = useState({
    id_membresia: '',
    metodo_pago: 'Efectivo',
    notas: ''
  });
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

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
      //aqui con keys se refiere a cada campo del formulario
      Object.keys(formData).forEach(campo => {
        const value = formData[campo];
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(campo, value);
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
  //ver detalles:

  const verDetallePago = (pago) => {
    setPagoDetalle(pago);
    setMostrarDetalles(true);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(false);
    setPagoDetalle(null);
  };
  //QUI YA NO
  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoSeleccionado(null);
    setFormData({
      id_membresia: '',
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

  // Función para filtrar pagos según la búsqueda
  const pagosFiltrados = pagos.filter((pago) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const clienteNombre = `${pago.membresia?.cliente?.nombre || ''} ${pago.membresia?.cliente?.apellido || ''}`.toLowerCase();
    const planNombre = pago.membresia?.plan_membresia?.nombre_plan?.toLowerCase() || '';
    
    return (
      pago.referencia?.toLowerCase().includes(terminoBusqueda) ||
      clienteNombre.includes(terminoBusqueda) ||
      planNombre.includes(terminoBusqueda) ||
      pago.metodo_pago?.toLowerCase().includes(terminoBusqueda) ||
      pago.procesado_por?.toLowerCase().includes(terminoBusqueda) ||
      pago.monto?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular los pagos a mostrar en la página actual
  const pagosPaginados = pagosFiltrados.slice(
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

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por referencia, cliente, plan, monto, método de pago o procesado por..."
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
            {pagosPaginados.length > 0 ? (
              pagosPaginados.map((pago) => (
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
                   // icon={<MoneyIcon />}
                    label={`L ${pago.monto?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    color="primary"
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
                    color="info"
                    onClick={() => verDetallePago(pago)}
                    size="small"
                    title="Ver Detalles"
                  >
                    <VisibilityIcon />
                  </IconButton>
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
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {busqueda ? 'No se encontraron pagos que coincidan con la búsqueda' : 'No hay pagos registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagosFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      {/* COMPONENTE MODAL DE INSERTAR/EDITAR */}
      <ModalComponent
        open={mostrarModal}
        onClose={cerrarModal}
        pagoSeleccionado={pagoSeleccionado}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        membresias={membresias.filter(m => m.estado === 'Activa')}
        error={error}
        comprobanteFile={comprobanteFile}
        comprobantePreview={comprobantePreview}
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleFileInputChange={handleFileInputChange}
        eliminarComprobantePreview={eliminarComprobantePreview}
      />

      {/* COMPONENTE DE VISTA DE DETALLES DEL PAGO */}
      <VistaPagosComponent 
        open={mostrarDetalles}
        onClose={cerrarDetalles}
        pagoDetalle={pagoDetalle}
      />
    </Container>
  );
};

export default Pago;
