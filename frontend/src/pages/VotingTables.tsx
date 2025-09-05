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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Party {
  _id: string;
  name: string;
  color: string;
}

interface VoteCount {
  party: string | Party;
  votes: number;
  _id?: string;
}

interface VotingTable {
  _id: string;
  tableNumber: number;
  location: string;
  totalVotes: number;
  votes: VoteCount[];
  createdAt: string;
  updatedAt: string;
}

const VotingTables = () => {
  const [tables, setTables] = useState<VotingTable[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState<VotingTable | null>(null);
  const [formData, setFormData] = useState<{
    tableNumber: string;
    location: string;
    votes: VoteCount[];
    totalVotes: number;
  }>({
    tableNumber: '',
    location: '',
    votes: [],
    totalVotes: 0,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [partiesRes, tablesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/parties'),
        axios.get('http://localhost:5000/api/voting-tables'),
      ]);

      setParties(partiesRes.data);
      setTables(tablesRes.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los datos');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  const handleOpenDialog = (table: VotingTable | null = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber.toString(),
        location: table.location,
        votes: [...table.votes],
        totalVotes: table.totalVotes,
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: '',
        location: '',
        votes: parties.map(party => ({
          party: party,  // Use the full party object
          votes: 0,
        })),
        totalVotes: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTable(null);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVoteChange = (index: number, value: string) => {
    setFormData(prev => {
      const newVotes = [...prev.votes];
      const voteValue = parseInt(value) || 0;
      
      newVotes[index] = {
        ...newVotes[index],
        votes: voteValue,
      };
      
      // Recalculate total votes
      const totalVotes = newVotes.reduce((sum, vote) => sum + (vote.votes || 0), 0);
      
      return {
        ...prev,
        votes: newVotes,
        totalVotes,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tableNumber = parseInt(formData.tableNumber);
      
      // Check for duplicate table number when creating a new table
      if (!editingTable) {
        const tableExists = tables.some(table => 
          table.tableNumber === tableNumber
        );
        
        if (tableExists) {
          setError('Ya existe una mesa con ese número');
          return;
        }
      }

      const data = {
        tableNumber,
        location: formData.location,
        totalVotes: formData.totalVotes,
        votes: formData.votes.map(vote => ({
          party: typeof vote.party === 'object' ? vote.party._id : vote.party,
          votes: vote.votes,
          ...(vote._id && { _id: vote._id })
        })),
      };

      if (editingTable) {
        // When editing, only check for duplicates if the table number has changed
        if (tableNumber !== editingTable.tableNumber) {
          const tableExists = tables.some(table => 
            table._id !== editingTable._id && table.tableNumber === tableNumber
          );
          
          if (tableExists) {
            setError('Ya existe otra mesa con ese número');
            return;
          }
        }
        
        const updatedTable = await axios.put(`http://localhost:5000/api/voting-tables/${editingTable._id}`, data);
        // Update the specific table in the tables array
        setTables(prevTables => 
          prevTables.map(table => 
            table._id === editingTable._id ? updatedTable.data : table
          )
        );
      } else {
        const newTable = await axios.post('http://localhost:5000/api/voting-tables', data);
        // Add the new table to the tables array
        setTables(prevTables => [...prevTables, newTable.data]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving voting table:', err);
      setError('Error al guardar la mesa de votación');
    }
  };

  const handleDeleteClick = (id: string) => {
    setTableToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tableToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/voting-tables/${tableToDelete}`);
      fetchData();
      setDeleteConfirmOpen(false);
      setTableToDelete(null);
    } catch (err) {
      console.error('Error deleting voting table:', err);
      setError('Error al eliminar la mesa de votación');
    }
  };

  const getPartyName = (partyId: string) => {
    const party = parties.find(p => p._id === partyId);
    return party ? party.name : 'Desconocido';
  };

  const getPartyColor = (partyId: string) => {
    const party = parties.find(p => p._id === partyId);
    return party ? party.color : '#cccccc';
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
        <Typography variant="h4">Mesas de Votación</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={parties.length === 0}
        >
          Agregar Mesa
        </Button>
      </Box>

      {parties.length === 0 && (
        <Box mb={3} p={2} bgcolor="warning.light" borderRadius={1}>
          <Typography>
            No hay partidos políticos registrados. Por favor, agregue al menos un partido antes de crear mesas de votación.
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} md={6} lg={4} key={table._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Mesa #{table.tableNumber}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleOpenDialog(table)}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(table._id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Ubicación: {table.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total de votos: {table.totalVotes}
                </Typography>
                
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Distribución de votos:
                  </Typography>
                  {table.votes.map((vote, index) => {
                    const partyId = typeof vote.party === 'string' ? vote.party : vote.party._id;
                    const partyName = typeof vote.party === 'string' 
                      ? getPartyName(partyId) 
                      : vote.party.name;
                    const partyColor = typeof vote.party === 'string'
                      ? getPartyColor(partyId)
                      : vote.party.color;
                      
                    return (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <Box
                          width={12}
                          height={12}
                          bgcolor={partyColor}
                          borderRadius="50%"
                          mr={1}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {partyName}:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {vote.votes} votos
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Table Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        scroll="paper"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingTable ? 'Editar Mesa de Votación' : 'Agregar Nueva Mesa de Votación'}
          </DialogTitle>
          {error && (
            <Box sx={{ backgroundColor: '#ffebee', p: 2, borderBottom: '1px solid #ffcdd2' }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
          <DialogContent dividers>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Mesa"
                  name="tableNumber"
                  type="number"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Votos por Partido:
                </Typography>
                
                {formData.votes.map((vote, index) => {
                  // Handle both cases where vote.party could be a string (ID) or Party object
                  const partyId = typeof vote.party === 'string' ? vote.party : vote.party._id;
                  const party = parties.find(p => p._id === partyId);
                  if (!party) return null;
                  
                  return (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Box
                        width={16}
                        height={16}
                        bgcolor={party.color}
                        borderRadius="4px"
                        mr={2}
                        flexShrink={0}
                      />
                      <Typography variant="body2" sx={{ minWidth: 150 }}>
                        {party.name}:
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={vote.votes}
                        onChange={(e) => handleVoteChange(index, e.target.value)}
                        inputProps={{ min: 0 }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  );
                })}
                
                {/* Total Votes Display */}
                <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total de Votos:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formData.totalVotes}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {editingTable ? 'Guardar Cambios' : 'Agregar'}
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
            ¿Estás seguro de que deseas eliminar esta mesa de votación? Esta acción no se puede deshacer.
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

export default VotingTables;
