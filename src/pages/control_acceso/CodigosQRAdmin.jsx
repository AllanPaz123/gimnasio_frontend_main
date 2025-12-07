import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import api from "../../api/http";
import { QRCodeCanvas } from "qrcode.react";

const CodigosQRAdmin = () => {
  const [codigos, setCodigos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ codigo_qr: "", horas_validez: "" });
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
  const [qrSeleccionado, setQrSeleccionado] = useState(null);

  const cargarCodigos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/control-acceso/codigo-qr/listar");
      setCodigos(response.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al cargar los códigos QR. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCodigos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerar = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.codigo_qr.trim()) {
      setError("El código QR es obligatorio");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/control-acceso/codigo-qr/manual", {
        codigo_qr: form.codigo_qr.trim(),
        horas_validez: form.horas_validez || undefined,
      });
      setSuccess("Código QR generado correctamente");
      setForm({ codigo_qr: "", horas_validez: "" });
      await cargarCodigos();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al generar el código QR. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString();
  };

  const isActivoYVigente = (codigo) => {
    if (!codigo.estado) return false;
    if (!codigo.fecha_Expiracion) return false;
    const ahora = new Date();
    const expiracion = new Date(codigo.fecha_Expiracion);
    return expiracion > ahora;
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Gestión de Códigos QR de Acceso
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generar código QR manual
          </Typography>
          <Box
            component="form"
            onSubmit={handleGenerar}
            sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}
          >
            <TextField
              label="Código QR"
              name="codigo_qr"
              value={form.codigo_qr}
              onChange={handleChange}
              size="small"
              required
            />
            <TextField
              label="Horas de validez"
              name="horas_validez"
              type="number"
              value={form.horas_validez}
              onChange={handleChange}
              size="small"
              helperText="Por defecto 24 horas si se deja vacío"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Generar manual"}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Historial de códigos QR
          </Typography>
          {codigos.length === 0 ? (
            <Typography>No hay códigos QR registrados.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Generado</TableCell>
                  <TableCell>Expira</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">QR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {codigos.map((c) => {
                  const activoVigente = isActivoYVigente(c);
                  return (
                    <TableRow key={c.id_codigo_qr}>
                      <TableCell>{c.id_codigo_qr}</TableCell>
                      <TableCell>{c.codigo_qr}</TableCell>
                      <TableCell>{c.tipo_codigo}</TableCell>
                      <TableCell>
                        {formatDateTime(c.fecha_Generacion)}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(c.fecha_Expiracion)}
                      </TableCell>
                      <TableCell>
                        {activoVigente ? (
                          <Chip
                            label="Activo / Vigente"
                            color="success"
                            size="small"
                          />
                        ) : c.estado ? (
                          <Chip
                            label="Activo / Expirado"
                            color="warning"
                            size="small"
                          />
                        ) : (
                          <Chip label="Inactivo" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setQrSeleccionado(c);
                            setQrPreviewOpen(true);
                          }}
                        >
                          Ver QR
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>

        <Dialog
          open={qrPreviewOpen}
          onClose={() => setQrPreviewOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Código QR</DialogTitle>
          <DialogContent
            sx={{ display: "flex", justifyContent: "center", py: 2 }}
          >
            {qrSeleccionado && (
              <QRCodeCanvas
                id="qr-image-canvas"
                value={qrSeleccionado.codigo_qr}
                size={256}
                includeMargin
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrPreviewOpen(false)}>Cerrar</Button>
            <Button
              variant="contained"
              onClick={() => {
                const canvas = document.getElementById("qr-image-canvas");
                if (!canvas) return;
                const pngUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = `qr-${qrSeleccionado?.codigo_qr || "codigo"}.png`;
                link.click();
              }}
            >
              Descargar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default CodigosQRAdmin;
