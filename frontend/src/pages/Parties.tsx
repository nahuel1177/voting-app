import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import axios from 'axios';

interface Party {
  _id: string;
  name: string;
  color: string;
  voteThreshold: number;
  createdAt: string;
  updatedAt: string;
}

const Parties = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#1976d2',
    voteThreshold: 0,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parties');
      setParties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los partidos');
      setLoading(false);
      console.error('Error fetching parties:', err);
    }
  };

  const handleOpenDialog = (party: Party | null = null) => {
    setEditingParty(party);
    if (party) {
      setFormData({
        name: party.name,
        color: party.color,
        voteThreshold: party.voteThreshold || 0,
      });
    } else {
      setFormData({
        name: '',
        color: '#1976d2',
        voteThreshold: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingParty(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'voteThreshold' ? parseInt(value) || 0 : value,
    }));
  };

  const handleColorChange = (color: any) => {
    setFormData(prev => ({
      ...prev,
      color: color.hex,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingParty) {
        await axios.put(`http://localhost:5000/api/parties/${editingParty._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/parties', formData);
      }
      fetchParties();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving party:', err);
      setError('Error al guardar el partido');
    }
  };

  const handleDeleteClick = (id: string) => {
    setPartyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partyToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/parties/${partyToDelete}`);
      fetchParties();
      setDeleteConfirmOpen(false);
      setPartyToDelete(null);
    } catch (err) {
      console.error('Error deleting party:', err);
      setError('Error al eliminar el partido');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Partidos Políticos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Partido
        </Button>
      </Box>

      {error && (
        <Box mb={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...parties].sort((a, b) => a.name.localeCompare(b.name)).map((party) => (
                  <TableRow key={party._id}>
                    <TableCell>{party.name}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: party.color,
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpenDialog(party)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(party._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Party Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingParty ? 'Editar Partido' : 'Agregar Nuevo Partido'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Partido"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  InputLabelProps={{
                    style: {
                      transform: 'translate(14px, 20px) scale(1)'
                    }
                  }}
                  InputProps={{
                    style: {
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Color del Partido
                </Typography>
                <Box display="flex" justifyContent="center">
                  <SketchPicker
                    color={formData.color}
                    onChangeComplete={handleColorChange}
                    disableAlpha
                    presetColors={[
                      '#f44336',
                      '#e91e63',
                      '#9c27b0',
                      '#673ab7',
                      '#3f51b5',
                      '#2196f3',
                      '#03a9f4',
                      '#00bcd4',
                      '#009688',
                      '#4caf50',
                      '#8bc34a',
                      '#cddc39',
                      '#ffeb3b',
                      '#ffc107',
                      '#ff9800',
                      '#ff5722',
                      '#795548',
                      '#9e9e9e',
                      '#607d8b',
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {editingParty ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este partido? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Parties;
