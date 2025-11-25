import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  Divider,
  Chip,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const VistaPagosComponent = ({ open, onClose, pagoDetalle }) => {
  if (!pagoDetalle) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}> <ReceiptIcon sx={{ mr: 2 }} color="primary" /> Detalles del Pago </Typography>
          <IconButton onClick={onClose} size="small"> <CloseIcon /> </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información del Cliente */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
              <Typography variant="h6" gutterBottom color="primary"> Información del Cliente </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Nombre:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.cliente?.nombre} {pagoDetalle.membresia?.cliente?.apellido}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">ID Cliente:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.cliente?.id_cliente}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Información de la Membresía */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
              <Typography variant="h6" gutterBottom color="info.main">
                Información de la Membresía
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Plan:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.plan?.nombre_plan}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Duración:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.plan?.duracion_dias} días
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fecha Inicio:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.fecha_inicio 
                      ? new Date(pagoDetalle.membresia.fecha_inicio).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fecha Vencimiento:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.membresia?.fecha_vencimiento 
                      ? new Date(pagoDetalle.membresia.fecha_vencimiento).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Estado:</Typography>
                  <Chip 
                    label={pagoDetalle.membresia?.estado} 
                    color={pagoDetalle.membresia?.estado === 'Activa' ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Información del Pago */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
              <Typography variant="h6" gutterBottom color="success.main">
                Información del Pago
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monto:</Typography>
                  <Typography variant="h6" fontWeight="700" color="success.main">
                    L {pagoDetalle.monto?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Método de Pago:</Typography>
                  <Chip label={pagoDetalle.metodo_pago} color="primary" size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Referencia:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.referencia || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fecha de Pago:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.fecha_pago 
                      ? new Date(pagoDetalle.fecha_pago).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Procesado por:</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {pagoDetalle.procesadoPor?.username || 'Sistema'}
                  </Typography>
                </Grid>
                {pagoDetalle.notas && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Notas:</Typography>
                    <Typography variant="body1">
                      {pagoDetalle.notas}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Grid>

          {/* Comprobante de Pago */}
          {pagoDetalle.comprobante && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Comprobante de Pago
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2
                  }}
                >
                  <img
                    src={`http://localhost:3000/${pagoDetalle.comprobante}`}
                    alt="Comprobante de Pago"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(`http://localhost:3000/${pagoDetalle.comprobante}`, '_blank')}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Haz clic en la imagen para verla en tamaño completo
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VistaPagosComponent;
