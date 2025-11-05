import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Paper,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';
import WcIcon from '@mui/icons-material/Wc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProfileView = ({ onEditClick, profileData: initialProfileData }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [loading, setLoading] = useState(!initialProfileData);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  // Tambahkan state untuk menyimpan file yang di-upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch profile data
  useEffect(() => {
    if (!initialProfileData) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getUserProfile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setProfileData(response.data.data);
          console.log('Profile data:', response.data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Gagal memuat data profil');
          toast.error('Gagal memuat data profil');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [initialProfileData]);

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.match('image.*')) {
      toast.error('Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 500 * 1024) {
      toast.error('Ukuran file maksimal 500KB');
      return;
    }

    // Simpan file ke state
    setSelectedFile(file);

    // Set preview image
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    setOpenUploadDialog(true);
  };

  // Handle file upload
  const handleUpload = async () => {
    // Gunakan selectedFile dari state bukan dari fileInputRef
    if (!selectedFile) {
      toast.error('Tidak ada file yang dipilih');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('fotoProfil', selectedFile); 

      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/uploadFotoProfil`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      toast.success('Foto profil berhasil diupload');
      // Refresh profile data
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getUserProfile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Gagal mengupload foto');
    } finally {
      setIsUploading(false);
      setOpenUploadDialog(false);
      setPreviewImage(null);
      setSelectedFile(null); // Reset selected file
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
      <CircularProgress color="secondary" />
    </Box>
  );

  if (error) return (
    <Box textAlign="center" py={4}>
      <Typography color="error" gutterBottom>{error}</Typography>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<RefreshIcon />}
        onClick={() => window.location.reload()}
      >
        Coba Lagi
      </Button>
    </Box>
  );

  if (!profileData) return (
    <Box textAlign="center" py={4}>
      <Typography variant="h6" color="textSecondary">
        Data tidak ditemukan
      </Typography>
    </Box>
  );

  // Get photo URL
  const photoUrl = profileData.fotoProfil?.url || 
  (profileData.calonkaryawan?.fotoProfil 
    ? `${import.meta.env.VITE_BASE_URL}/${profileData.calonkaryawan.fotoProfil.replace(/\\/g, '/')}`
    : null);

  return (
    <>
      <Paper elevation={10} sx={{ maxWidth: 1200, mx: 'auto', p: 4, borderRadius: 4 }}>
        {/* Header Section with Photo */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} 
             justifyContent="space-between" alignItems="center" mb={4} pb={3} 
             borderBottom="1px solid" borderColor="divider">
          <Box display="flex" alignItems="center" gap={3}>
            <Tooltip title="Klik atau drag & drop foto untuk mengubah">
              <Box 
                position="relative"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    '& .avatar-overlay': {
                      opacity: 1
                    }
                  }
                }}
              >
                <Avatar
                  src={photoUrl || previewImage}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    border: '3px solid', 
                    borderColor: isDragging ? 'primary.main' : 'secondary.main',
                    bgcolor: 'primary.light',
                    fontSize: '2.5rem',
                    transition: 'all 0.3s ease',
                    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isDragging ? 3 : 0
                  }}
                >
                  {!photoUrl && !previewImage && profileData.name?.charAt(0)}
                </Avatar>
                
                {/* Hover overlay */}
                <Box
                  className="avatar-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <AddAPhotoIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                {/* Upload icon badge */}
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'secondary.main',
                    borderRadius: '50%',
                    p: 0.5,
                    zIndex: 2
                  }}
                >
                  <CloudUploadIcon fontSize="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </Tooltip>
            
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {profileData.name || profileData.calonkaryawan?.namaLengkap || 'Nama Pengguna'}
              </Typography>
              <Chip
                label={`${profileData.isPremium ? 'Premium' : 'Reguler'}`}
                color={profileData.isPremium ? 'primary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={onEditClick}
            sx={{ mt: { xs: 3, md: 0 } }}
          >
            Edit Profil
          </Button>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* User Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonOutlineIcon color="primary" />
                    <Typography variant="h6" component="span">
                      Informasi Akun
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <ProfileInfoItem 
                  icon={<EmailIcon color="action" />}
                  label="Email" 
                  value={profileData.email} 
                />
                <ProfileInfoItem 
                  icon={<PhoneIcon color="action" />}
                  label="Nomor Telepon" 
                  value={profileData.phoneNumber || '-'} 
                />
                {photoUrl && (
                  <ProfileInfoItem 
                    icon={<CloudUploadIcon color="action" />}
                    label="Foto Profil" 
                    value={
                      <Typography 
                        component="a" 
                        href={photoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                      >
                        Lihat Foto
                      </Typography>
                    } 
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Candidate Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <WorkOutlineIcon color="primary" />
                    <Typography variant="h6" component="span">
                      Data Diri
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <ProfileInfoItem 
                  icon={<PersonOutlineIcon color="action" />}
                  label="Nama Lengkap" 
                  value={profileData.calonkaryawan?.namaLengkap || '-'} 
                />
                <ProfileInfoItem 
                  icon={<HomeIcon color="action" />}
                  label="Alamat" 
                  value={profileData.calonkaryawan?.alamat || '-'} 
                />
                <ProfileInfoItem 
                  icon={<CakeIcon color="action" />}
                  label="Tanggal Lahir" 
                  value={
                    profileData.calonkaryawan?.tanggalLahir 
                      ? new Date(profileData.calonkaryawan.tanggalLahir).toLocaleDateString('id-ID') 
                      : '-'
                  } 
                />
                <ProfileInfoItem 
                  icon={<WcIcon color="action" />}
                  label="Jenis Kelamin" 
                  value={profileData.calonkaryawan?.jenisKelamin || '-'} 
                />
                <ProfileInfoItem 
                  icon={<SchoolIcon color="action" />}
                  label="Pendidikan Terakhir" 
                  value={profileData.calonkaryawan?.pendidikanTerakhir || '-'} 
                />
                <ProfileInfoItem 
                  icon={<SchoolIcon color="action" />}
                  label="Jurusan" 
                  value={profileData.calonkaryawan?.jurusan || '-'} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => !isUploading && setOpenUploadDialog(false)}>
        <DialogTitle>Upload Foto Profil</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                src={previewImage}
                sx={{ 
                  width: 150, 
                  height: 150,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              />
            </Box>
          )}
          
          {isUploading ? (
            <Box>
              <Typography variant="body2" gutterBottom>
                Mengupload foto...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" display="block" textAlign="right" mt={1}>
                {uploadProgress}%
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography>
                Klik atau drag & drop file gambar di sini
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Format: JPEG/PNG (Maks. 500KB)
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenUploadDialog(false);
              setSelectedFile(null);
              setPreviewImage(null);
            }} 
            disabled={isUploading}
          >
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!previewImage || isUploading}
            variant="contained"
            color="primary"
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          >
            {isUploading ? 'Mengupload...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ProfileInfoItem = ({ icon, label, value }) => (
  <Box mb={3}>
    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
      <IconButton size="small" sx={{ p: 0 }}>
        {icon}
      </IconButton>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ ml: 4 }}>
      {value}
    </Typography>
  </Box>
);

export default ProfileView;