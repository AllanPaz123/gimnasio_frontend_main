import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/http';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/autenticacion/login', formData);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirigir al home
      navigate('/');
      
      // Recargar la página para aplicar el token
      window.location.reload();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.response?.data?.mensaje) {
        setError(error.response.data.mensaje);
      } else if (error.response?.data?.errores) {
        setError(error.response.data.errores.map(e => e.msg).join(', '));
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Credenciales por defecto:</strong><br />
              Usuario: admin<br />
              Contraseña: (la que hayas configurado)
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
