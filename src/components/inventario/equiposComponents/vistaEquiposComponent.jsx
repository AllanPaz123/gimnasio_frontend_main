import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    Typography,
    Divider,
    Stack,
    Button,
    Chip,
    Box,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';

const VistaEquiposComponent = ({ open, onClose, equipoDetalle }) => {
    if (!equipoDetalle) return null;

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                        <FitnessCenterIcon sx={{ mr: 2 }} color="primary" />
                        Detalles del Equipo
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Información de Categoría */}
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Categoría
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Categoría del Equipo:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.categoria_equipo?.nombre_categoria || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Información General del Equipo */}
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
                            <Typography variant="h6" gutterBottom color="info.main">
                                Información del Equipo
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Nombre:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.nombre_equipo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Estado:</Typography>
                                    <Chip 
                                        label={equipoDetalle.estado}
                                        color={getEstadoColor(equipoDetalle.estado)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Marca:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.marca}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Modelo:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.modelo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Número de Serie:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.numero_serie}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Ubicación:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.ubicacion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Fecha de Compra:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.fecha_compra ? new Date(equipoDetalle.fecha_compra).toLocaleDateString('es-HN') : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Costo:</Typography>
                                    <Typography variant="body1" fontWeight="600" color="success.main">
                                        L {equipoDetalle.costo?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Descripción:</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {equipoDetalle.descripcion || 'Sin descripción'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Imagen del Equipo */}
                    {equipoDetalle.foto && (
                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
                                <Typography variant="h6" gutterBottom color="success.main">
                                    Imagen del Equipo
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <img 
                                        src={`http://localhost:3000/${equipoDetalle.foto}`}
                                        alt={equipoDetalle.nombre_equipo}
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '500px', 
                                            objectFit: 'contain',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => window.open(`http://localhost:3000/${equipoDetalle.foto}`, '_blank')}
                                    />
                                </Box>
                                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1 }} color="text.secondary">
                                    Haz clic en la imagen para verla en tamaño completo
                                </Typography>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VistaEquiposComponent;