import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/http';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from '@mui/material';
import {
  FitnessCenter as GymIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';

export default function Home() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const response = await api.get('/api/pagos/planes/listar');
      setPlanes(response.data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    }
  };

  // Secciones informativas (puedes editar estos datos después)
  const seccionesInformativas = [
    {
      id: 1,
      titulo: 'Entrenamiento Personalizado',
      descripcion: 'Nuestros entrenadores certificados diseñan rutinas específicas para tus objetivos. Alcanza tu mejor versión con seguimiento profesional.',
      imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      icono: <GymIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      id: 2,
      titulo: 'Horarios Flexibles',
      descripcion: 'Abierto de lunes a domingo con horarios amplios que se adaptan a tu estilo de vida. Entrena cuando mejor te convenga.',
      imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      icono: <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      id: 3,
      titulo: 'Instalaciones de Primera',
      descripcion: 'Equipamiento de última generación, áreas climatizadas, vestuarios modernos y zonas de entrenamiento especializadas.',
      imagen: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
      icono: <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      id: 4,
      titulo: 'Promociones Especiales',
      descripcion: 'Descuentos por referidos, planes familiares y promociones mensuales. Consulta nuestras ofertas vigentes.',
      imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      icono: <OfferIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Navbar */}
      <Navbar />

      {/* Banner de Bienvenida */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&fit=crop)', // Puedes cambiar esta URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 2,
              textShadow: '2px 4px 8px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Bienvenidos a Gimnasio Aesthetic
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400,
              mb: 4,
              textShadow: '1px 2px 4px rgba(0,0,0,0.2)',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Descubre lo que tenemos para ofrecerte
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<GymIcon />}
              label="Entrenamiento Premium"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem',
                py: 3,
                px: 1
              }}
            />
            <Chip
              icon={<StarIcon />}
              label="Instalaciones Modernas"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem',
                py: 3,
                px: 1
              }}
            />
            <Chip
              icon={<OfferIcon />}
              label="Mejores Precios"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1rem',
                py: 3,
                px: 1
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Tabla de Planes de Membresía */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Nuestros Planes de Membresía
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Elige el plan que mejor se adapte a tus necesidades y comienza tu transformación hoy mismo
          </Typography>
        </Box>

        <TableContainer 
          component={Paper} 
          elevation={4}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 8
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                  Plan
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                  Descripción
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">
                  Duración
                </TableCell>
               
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">
                  Estado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planes.map((plan) => (
                <TableRow
                  key={plan.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:nth-of-type(odd)': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" fontWeight={600} color="primary">
                      {plan.nombre_plan}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {plan.descripcion}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<ScheduleIcon />}
                      label={`${plan.duracion_dias} días`}
                      size="small"
                      color="info"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={plan.estado === 'Activo' ? 'Disponible' : plan.estado}
                      size="small"
                      color={plan.estado === 'Activo' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Secciones Informativas */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Conoce todo lo que Gimnasio Aesthetic tiene preparado para ti
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {seccionesInformativas.map((seccion) => (
            <Grid item xs={12} sm={6} md={3} key={seccion.id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)'
                  },
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={seccion.imagen}
                  alt={seccion.titulo}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {seccion.icono}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight={700}
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    {seccion.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {seccion.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 4,
          mt: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Gimnasio Aesthetic
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © 2025 Todos los derechos reservados. Sistema de Gestión Integral
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}