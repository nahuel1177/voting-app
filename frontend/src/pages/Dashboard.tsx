import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  useTheme
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Context } from 'chartjs-plugin-datalabels/types/context';
import { Bar } from 'react-chartjs-2';
import { updateSettings } from '../services/settingsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Party {
  _id: string;
  name: string;
  color: string;
  voteThreshold?: number;
}

interface Result {
  party: Party;
  votes: number;
  percentage: number;
  councilors: number;
  votesPerCouncilor?: number;
  remainder?: number;
}

const Dashboard = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [councilorResults, setCouncilorResults] = useState<Result[]>([]);
  const [votesPerCouncilor, setVotesPerCouncilor] = useState(1000);
  const [totalCouncilors, setTotalCouncilors] = useState(8);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    votesPerCouncilor: 1000,
    totalCouncilors: 8
  });
  const [saving, setSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchResults();
    fetchCouncilorResults();
  }, []);

  const fetchCouncilorResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/voting-tables/councilors');
      setCouncilorResults(response.data.results);
      setVotesPerCouncilor(response.data.votesPerCouncilor || 1000);
      setTotalCouncilors(response.data.totalCouncilors || 8);
      setSettings(prev => ({ 
        ...prev, 
        votesPerCouncilor: response.data.votesPerCouncilor || 1000,
        totalCouncilors: response.data.totalCouncilors || 8
      }));
    } catch (err) {
      console.error('Error fetching councilor results:', err);
    }
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setSettingsError('');
  };

  const handleSettingsSave = async () => {
    try {
      setSaving(true);
      setSettingsError('');
      
      // Validate
      if (settings.votesPerCouncilor <= 0) {
        setSettingsError('Los votos por concejal deben ser mayores a 0');
        return;
      }
      
      if (settings.totalCouncilors <= 0) {
        setSettingsError('El total de concejales debe ser mayor a 0');
        return;
      }
      
      await updateSettings({
        votesPerCouncilor: settings.votesPerCouncilor,
        totalCouncilors: settings.totalCouncilors
      });
      
      // Update local state
      setVotesPerCouncilor(settings.votesPerCouncilor);
      setTotalCouncilors(settings.totalCouncilors);
      
      // Refresh data
      await fetchCouncilorResults();
      
      // Close dialog
      setSettingsOpen(false);
    } catch (err) {
      console.error('Error updating settings:', err);
      setSettingsError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/voting-tables/results');
      setResults(response.data.results);
      setTotalVotes(response.data.totalVotes);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los resultados');
      setLoading(false);
      console.error('Error fetching results:', err);
    }
  };

  // Sort results by number of votes in descending order
  const sortedResults = [...results].sort((a, b) => b.votes - a.votes);

  const chartData = {
    labels: sortedResults.map((result) => result.party.name),
    datasets: [
      {
        label: 'Porcentaje de Votos (%)',
        data: sortedResults.map((result) => result.percentage),
        backgroundColor: sortedResults.map((result) => result.party.color || '#1976d2'),
        borderColor: sortedResults.map((result) => result.party.color || '#1976d2'),
        borderWidth: 1,
      },
    ],
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            weight: 500
          }
        },
        grid: {
          color: theme.palette.divider,
          display: false
        },
        title: {
          display: true,
          text: 'Partidos Políticos',
          color: theme.palette.text.primary,
          font: {
            weight: 500
          }
        }
      },
      y: {
        beginAtZero: true,
        max: results.some(r => r.percentage > 45) ? 70 : 50,
        ticks: {
          color: theme.palette.text.primary,
          callback: function(value: number | string) {
            return `${value}%`;
          },
          font: {
            weight: 500
          }
        },
        grid: {
          color: theme.palette.divider,
          borderDash: [4, 4]
        },
        title: {
          display: true,
          text: 'Porcentaje de Votos (%)',
          color: theme.palette.text.primary,
          font: {
            weight: 500
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribución de Votos',
        color: theme.palette.text.primary,
        font: {
          size: 16,
          weight: 600
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: theme.shadows[3],
        callbacks: {
          label: function(context: any) {
            const voteCount = results[context.dataIndex].votes;
            const percentage = parseFloat(context.raw).toFixed(1);
            return [
              `Partido: ${context.label}`,
              `Votos: ${voteCount.toLocaleString()}`,
              `Porcentaje: ${percentage}%`
            ];
          }
        }
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => {
          const total = chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%';
        },
        color: isDarkMode ? '#fff' : '#000',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        textShadowBlur: 4,
        textStrokeColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        textStrokeWidth: 1
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" my={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Elecciones Lesgislativas 2025
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total Votes Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Votos
              </Typography>
              <Typography variant="h5">{totalVotes.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Number of Parties Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Partidos Políticos
              </Typography>
              <Typography variant="h5">{results.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Leading Party Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Partido Líder
              </Typography>
              <Typography variant="h5">
                {results.length > 0 
                  ? `${results[0].party.name} (${results[0].percentage.toFixed(1)}%)`
                  : 'No hay datos'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Votos
            </Typography>
            <Box height={400}>
              <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
            </Box>
          </Paper>
        </Grid>

        {/* Results Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resultados Detallados
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Partido</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Votos</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((result) => (
                    <tr key={result.party._id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                        <Box display="flex" alignItems="center">
                          <Box
                            width={16}
                            height={16}
                            bgcolor={result.party.color || '#1976d2'}
                            mr={1}
                            borderRadius="50%"
                          />
                          <Typography variant="h6">
                            {result.party.name}
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>
                        {result.votes.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>
                        {result.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Councilor Calculation Section */}
      <Box mt={3}>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
          <Typography variant="h6" component="div">
            Cálculo de Concejales
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cociente actual: 1 concejal cada {votesPerCouncilor.toLocaleString()} votos
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="medium">
            Total de concejales a repartir: {totalCouncilors}
          </Typography>
        </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSettingsOpen}
            size="small"
          >
            Configurar
          </Button>
        </Box>
        
          {councilorResults.length > 0 ? (
            <Grid container spacing={2}>
              {councilorResults.map((result, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ 
                    borderLeft: `4px solid ${result.party.color}`,
                    height: '100%',
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)'
                  }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" color="textPrimary">
                            {result.party.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {result.votes.toLocaleString()} votos
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {result.percentage.toFixed(1)}% del total
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary">
                            {result.councilors}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            Concejales
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary" textAlign="center" py={4}>
              
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración de Cálculo de Concejales</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Se repartirán exactamente {settings.totalCouncilors} concejales entre los partidos según el método D'Hondt.
          </Alert>
          {settingsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {settingsError}
            </Alert>
          )}
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Votos por Concejal"
                  type="number"
                  value={settings.votesPerCouncilor}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setSettings(prev => ({ ...prev, votesPerCouncilor: value }));
                  }}
                  inputProps={{ min: 1 }}
                  helperText="Votos necesarios por concejal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Total de Concejales"
                  type="number"
                  value={settings.totalCouncilors}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setSettings(prev => ({ ...prev, totalCouncilors: value }));
                  }}
                  inputProps={{ min: 1 }}
                  helperText="Total de concejales a repartir"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleSettingsClose} disabled={saving}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSettingsSave} 
            variant="contained" 
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
