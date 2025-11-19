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
  Switch,
  FormControlLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  LocalOffer as PlanIcon,
  FitnessCenter as GymIcon,
  PersonOutline as TrainerIcon,
  SmartToy as AssistantIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const PlanMembresia = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre_plan: '',
    descripcion: '',
    duracion_dias: '',
    acceso_gimnasio: true,
    acceso_entrenador: false,
    acceso_asistente_virtual: false,
    estado: 'Activa'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPlanes();
  }, []);

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
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (planSeleccionado) {
        await api.put(`/api/pagos/planes/editar?id=${planSeleccionado.id}`, formData);
      } else {
        await api.post('/api/pagos/planes/guardar', formData);
      }
      
      cargarPlanes();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar plan:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar plan');
      }
    }
  };

  const editarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setFormData({
      nombre_plan: plan.nombre_plan || '',
      descripcion: plan.descripcion || '',
      duracion_dias: plan.duracion_dias || '',
      acceso_gimnasio: plan.acceso_gimnasio || false,
      acceso_entrenador: plan.acceso_entrenador || false,
      acceso_asistente_virtual: plan.acceso_asistente_virtual || false,
      estado: plan.estado || 'Activa'
    });
    setMostrarModal(true);
  };

  const eliminarPlan = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await api.delete(`/api/pagos/planes/eliminar?id=${id}`);
        cargarPlanes();
      } catch (error) {
        console.error('Error al eliminar plan:', error);
        setError('Error al eliminar plan');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPlanSeleccionado(null);
    setFormData({
      nombre_plan: '',
      descripcion: '',
      duracion_dias: '',
      acceso_gimnasio: true,
      acceso_entrenador: false,
      acceso_asistente_virtual: false,
      estado: 'Activa'
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    return estado === 'Activa' ? 'success' : 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <PlanIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
            Gestión de Planes de Membresía
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setMostrarModal(true)}
            size="large"
          >
            Nuevo Plan
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Plan</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duración</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Beneficios</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planes.map((plan) => (
              <TableRow 
                key={plan.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="600">
                    {plan.nombre_plan}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {plan.descripcion || 'Sin descripción'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<TimeIcon />}
                    label={`${plan.duracion_dias} días`}
                    color="info"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {plan.acceso_gimnasio && (
                      <Chip 
                        icon={<GymIcon />}
                        label="Gimnasio"
                        color="success"
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                    {plan.acceso_entrenador && (
                      <Chip 
                        icon={<TrainerIcon />}
                        label="Entrenador"
                        color="primary"
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                    {plan.acceso_asistente_virtual && (
                      <Chip 
                        icon={<AssistantIcon />}
                        label="Asistente Virtual"
                        color="secondary"
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={plan.estado}
                    color={getEstadoColor(plan.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => editarPlan(plan)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => eliminarPlan(plan.id)}
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
              {planSeleccionado ? 'Editar Plan' : 'Nuevo Plan'}
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
              Información del Plan
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Plan"
                  name="nombre_plan"
                  value={formData.nombre_plan}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 50 }}
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
                  required
                  type="number"
                  label="Duración (días)"
                  name="duracion_dias"
                  value={formData.duracion_dias}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: <TimeIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
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
                  <MenuItem value="Activa">Activa</MenuItem>
                  <MenuItem value="Inactiva">Inactiva</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Beneficios del Plan
                    </Typography>
                    
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.acceso_gimnasio}
                            onChange={handleInputChange}
                            name="acceso_gimnasio"
                            color="success"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GymIcon sx={{ mr: 1 }} color={formData.acceso_gimnasio ? 'success' : 'disabled'} />
                            <Typography>Acceso al Gimnasio</Typography>
                          </Box>
                        }
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.acceso_entrenador}
                            onChange={handleInputChange}
                            name="acceso_entrenador"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrainerIcon sx={{ mr: 1 }} color={formData.acceso_entrenador ? 'primary' : 'disabled'} />
                            <Typography>Entrenador Personal</Typography>
                          </Box>
                        }
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.acceso_asistente_virtual}
                            onChange={handleInputChange}
                            name="acceso_asistente_virtual"
                            color="secondary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AssistantIcon sx={{ mr: 1 }} color={formData.acceso_asistente_virtual ? 'secondary' : 'disabled'} />
                            <Typography>Asistente Virtual</Typography>
                          </Box>
                        }
                      />
                    </Stack>
                  </CardContent>
                </Card>
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
            {planSeleccionado ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlanMembresia;
