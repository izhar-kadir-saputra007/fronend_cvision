import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Divider,
  IconButton,
  useTheme,
  Link
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  Event as DateIcon,
  Send as ApplyIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Link as RouterLink } from 'react-router-dom';

const LowonganList = () => {
  const theme = useTheme();
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyStatus, setApplyStatus] = useState({});
  const [selectedLowongan, setSelectedLowongan] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [openProfileIncompleteDialog, setOpenProfileIncompleteDialog] = useState(false);

  // Mengambil data lowongan
  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getAllLowongan`);
        setLowongan(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLowongan();
  }, []);

  // Fungsi untuk memeriksa kelengkapan profil
  const checkProfileCompleteness = (profileData) => {
    if (!profileData || !profileData.calonkaryawan) {
      return ['data profil'];
    }
    
    const { calonkaryawan } = profileData;
    const missingFields = [];
    
    // Periksa setiap field penting dalam calonkaryawan
    if (!calonkaryawan.namaLengkap) missingFields.push('nama lengkap');
    if (!calonkaryawan.alamat) missingFields.push('alamat');
    if (!calonkaryawan.tanggalLahir) missingFields.push('tanggal lahir');
    if (!calonkaryawan.jenisKelamin) missingFields.push('jenis kelamin');
    if (!calonkaryawan.pendidikanTerakhir) missingFields.push('pendidikan terakhir');
    if (!calonkaryawan.jurusan) missingFields.push('jurusan');
    if (!calonkaryawan.fotoProfil) missingFields.push('foto profil');
    
    return missingFields;
  };

  const handleOpenModal = (lowongan) => {
    setSelectedLowongan(lowongan);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLowongan(null);
  };

  // Menangani klik tombol Lamar - sekarang dengan pengecekan profil
  const handleApplyClick = async () => {
    setProfileLoading(true);
    
    try {
      // Ambil profil user dari API
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/getUserProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      const profileData = response.data.data;
      setUserProfile(profileData);
      
      // Periksa kelengkapan profil
      const missing = checkProfileCompleteness(profileData);
      setMissingFields(missing);
      
      if (missing.length > 0) {
        // Profil tidak lengkap, tampilkan dialog peringatan
        setOpenProfileIncompleteDialog(true);
      } else {
        // Profil lengkap, lanjutkan ke konfirmasi aplikasi
        setOpenConfirm(true);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Gagal memuat profil pengguna. Silakan coba lagi.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedLowongan) return;

    try {
      setApplyStatus(prev => ({ 
        ...prev, 
        [selectedLowongan.id]: { status: 'loading', message: '' } 
      }));
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/applyToLowongan/${selectedLowongan.id}/aply`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setApplyStatus(prev => ({
        ...prev,
        [selectedLowongan.id]: { 
          status: 'success', 
          message: 'Lamaran berhasil dikirim!' 
        }
      }));

      setOpenConfirm(false);
    } catch (err) {
      console.error('Error applying to lowongan:', err);
      setApplyStatus(prev => ({
        ...prev,
        [selectedLowongan.id]: { 
          status: 'error', 
          message: err.response?.data?.message || 'Gagal mengirim lamaran. Silakan coba lagi.' 
        }
      }));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1">Terjadi kesalahan saat memuat data:</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <WorkIcon fontSize="large" />
        Daftar Lowongan Pekerjaan
      </Typography>

      {lowongan.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Tidak ada lowongan tersedia saat ini.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {lowongan.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
            <Card elevation={3} sx={{ 
              height: '100%',
              color: 'white',
              backgroundColor: '#070F2B',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              transition: '0.3s',
              boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)",
              '&:hover': {
                transform: 'translateY(-2px)',
                border: '1px solid #00C3FE',
                boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)"
              }
            }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        color : '#00C3FE',
                        mr: 2,
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem'
                      }}
                    >
                      {item.PT.namaPT.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {item.judul}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, fontSize: '1rem',color: '#00C3FE' }} />
                        {item.PT.namaPT}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                    <DateIcon color="action" sx={{ mr: 1, fontSize: '1rem', color: '#00C3FE' }} />
                    <Typography variant="caption" color="#737373">
                      Tutup: {new Date(item.tanggalTutup).toLocaleDateString('id-ID')}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<ApplyIcon fontSize="small" />}
                    onClick={() => handleOpenModal(item)}
                    disabled={applyStatus[item.id]?.status === 'loading' || applyStatus[item.id]?.status === 'success'}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 2,
                      py: 0.5,
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    Lamar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Detail Lowongan */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" component="div">
            {selectedLowongan?.judul}
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ py: 2 }}>
          {selectedLowongan && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <BusinessIcon sx={{ mr: 1, fontSize: '1rem' }} /> {selectedLowongan.PT.namaPT}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedLowongan.PT.alamat}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 1, fontSize: '1rem' }} /> Periode Lowongan
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedLowongan.tanggalBuka).toLocaleDateString('id-ID')} - {new Date(selectedLowongan.tanggalTutup).toLocaleDateString('id-ID')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Deskripsi Pekerjaan</Typography>
                <Typography variant="body2" paragraph>
                  {selectedLowongan.deskripsi}
                </Typography>
              </Box>
              
              {/* Style untuk memperbaiki tampilan list di markdown */}
              <style>{`
                .wmde-markdown ul, .markdown-preview ul {
                  list-style-type: disc !important;
                  padding-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                
                .wmde-markdown ol, .markdown-preview ol {
                  list-style-type: decimal !important;
                  padding-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                
                .wmde-markdown li, .markdown-preview li {
                  margin-bottom: 0.25rem !important;
                  padding-left: 0.25rem !important;
                }
                
                .wmde-markdown h3, .markdown-preview h3 {
                  font-weight: bold;
                  margin-bottom: 0.75rem !important;
                  margin-top: 1rem !important;
                }
                
                .wmde-markdown hr, .markdown-preview hr {
                  margin: 1rem 0 !important;
                }
                
                .wmde-markdown strong, .markdown-preview strong {
                  font-weight: bold;
                }
              `}</style>

              {selectedLowongan.persyaratan && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Persyaratan</Typography>
                  <MDEditor.Markdown 
                    source={selectedLowongan.persyaratan} 
                    style={{
                      color: '#333',             
                      backgroundColor: '#f9f9f9', 
                      boxShadow: theme.shadows[1],
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                    className="wmde-markdown"
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          justifyContent: 'space-between',
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ flex: 1 }}>
            {applyStatus[selectedLowongan?.id]?.status === 'success' && (
              <Alert severity="success" sx={{ py: 0.5, fontSize: '0.8rem' }}>
                {applyStatus[selectedLowongan?.id]?.message}
              </Alert>
            )}
            {applyStatus[selectedLowongan?.id]?.status === 'error' && (
              <Alert severity="error" sx={{ py: 0.5, fontSize: '0.8rem' }}>
                {applyStatus[selectedLowongan?.id]?.message}
              </Alert>
            )}
          </Box>
          
          <Box>
            <Button 
              onClick={handleCloseModal} 
              color="inherit"
              size="small"
              sx={{ mr: 1 }}
            >
              Tutup
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyClick}
              disabled={profileLoading || applyStatus[selectedLowongan?.id]?.status === 'loading' || applyStatus[selectedLowongan?.id]?.status === 'success'}
              endIcon={profileLoading ? <CircularProgress size={16} /> : <ApplyIcon fontSize="small" />}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                px: 2,
                py: 0.5
              }}
            >
              {profileLoading ? 'Memeriksa...' : (applyStatus[selectedLowongan?.id]?.status === 'loading' ? 'Mengirim...' : 'Kirim Lamaran')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1, fontSize: '1.25rem' }} />
          <Typography variant="subtitle1">Konfirmasi Lamar Pekerjaan</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <DialogContentText variant="body2">
            Apakah Anda yakin ingin melamar posisi "{selectedLowongan?.judul}" di {selectedLowongan?.PT.namaPT}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenConfirm(false)} 
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Batal
          </Button>
          <Button 
            onClick={handleApply} 
            color="primary"
            variant="contained"
            size="small"
            disabled={applyStatus[selectedLowongan?.id]?.status === 'loading'}
            sx={{ textTransform: 'none' }}
          >
            Ya, Lamar Sekarang
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Profil Tidak Lengkap */}
      <Dialog
        open={openProfileIncompleteDialog}
        onClose={() => setOpenProfileIncompleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          py: 2, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.contrastText
        }}>
          <ErrorIcon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
          <Typography variant="h6">Data Profil Belum Lengkap</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              Untuk dapat melamar pekerjaan, Anda perlu melengkapi data profil terlebih dahulu.
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
              Data yang perlu dilengkapi:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff9f9' }}>
              <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                {missingFields.map((field, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    <Typography variant="body2" color="error.main">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={() => setOpenProfileIncompleteDialog(false)} 
            color="inherit"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Tutup
          </Button>
          <Button 
            component={RouterLink}
            to="/profile" 
            color="primary"
            variant="contained"
            startIcon={<PersonIcon />}
            size="small"
            onClick={() => setOpenProfileIncompleteDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Lengkapi Profil Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LowonganList;