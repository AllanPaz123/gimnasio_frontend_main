import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Box,
  Card,
  Divider,
  Alert,
  IconButton,
  Stack,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const ModalComponent = ({
  open,
  onClose,
  pagoSeleccionado,
  formData,
  handleInputChange,
  handleSubmit,
  membresias,
  error,
  comprobanteFile,
  comprobantePreview,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileInputChange,
  eliminarComprobantePreview
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            {pagoSeleccionado ? 'Editar Pago' : 'Nuevo Pago'}
          </Typography>
          <IconButton onClick={onClose} size="small">
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
          
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                required
                label="Membresía"
                name="id_membresia"
                value={formData.id_membresia}
                onChange={handleInputChange}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 400,
                        width: '400px'
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: '56px'
                  },
                  '& .MuiSelect-select': {
                    fontSize: '1.1rem',
                    paddingTop: '16px',
                    paddingBottom: '16px'
                  }
                }}
              >
                <MenuItem value="">Seleccione una membresía</MenuItem>
                {membresias.map(membresia => (
                  <MenuItem 
                    key={membresia.id} 
                    value={membresia.id}
                    sx={{ 
                      whiteSpace: 'normal',
                      py: 2,
                      minHeight: '70px'
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" fontWeight="600">
                        {membresia.cliente?.nombre} {membresia.cliente?.apellido}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        Plan: {membresia.plan?.nombre_plan}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vence: {membresia.fecha_vencimiento 
                          ? new Date(membresia.fecha_vencimiento).toLocaleDateString('es-HN')
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
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
          onClick={onClose}
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
  );
};

export default ModalComponent;
