import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
    cliente: {
      nombre: "",
      apellido: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("cliente.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cliente: { ...prev.cliente, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/api/usuario/registro-publico", formData);
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Error en registro:", err);
      if (err.response?.data?.errores) {
        setError(err.response.data.errores.map((e) => e.msg).join("\n"));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al registrar. Inténtalo nuevamente.");
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center">
            Registro de Cliente
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, whiteSpace: "pre-line" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre"
              name="cliente.nombre"
              value={formData.cliente.nombre}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Apellido"
              name="cliente.apellido"
              value={formData.cliente.apellido}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Fecha de nacimiento"
              name="fecha_nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="genero-label">Género</InputLabel>
              <Select
                labelId="genero-label"
                id="genero"
                name="genero"
                value={formData.genero}
                label="Género"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>

            <Button fullWidth variant="text" onClick={() => navigate("/login")}>
              Volver al inicio de sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
