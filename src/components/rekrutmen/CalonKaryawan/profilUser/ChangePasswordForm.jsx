import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { 
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  Alert,
  CircularProgress,

} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Password saat ini wajib diisi'),
    newPassword: Yup.string()
      .min(8, 'Password minimal 8 karakter')
      .required('Password baru wajib diisi'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Password harus sama')
      .required('Konfirmasi password wajib diisi')
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error('Anda belum login');
        }

        const response = await axios.put(
          'http://localhost:3000/api/changePassword',
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confNewPassword: values.confirmPassword
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setSuccess('Password berhasil diubah!');
        formik.resetForm();
        
      } catch (err) {
        if (err.response) {
          setError(err.response.data.msg || 'Terjadi kesalahan saat mengubah password');
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan jaringan');
        }
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Paper 
    elevation={3} 
    sx={{ 
      p: 4, 
      maxWidth: 500, 
      mx: 'auto', 
      mt: 4, 
      bgcolor: "#070F2B", 
      boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.5)", 
      borderRadius: "8px", 
      color: "#f0f0f0f0"  // <- Ini yang diperbaiki
    }}
  >
      <Typography variant="h5" component="h1" gutterBottom>
        Ganti Password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit}>
        <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
          <InputLabel htmlFor="currentPassword"sx={{ color: "#f0f0f0f0",  '&.Mui-focused': {
        color: '#4caf50', // Warna label saat focus
      }, }}>Password Saat Ini</InputLabel>
          <OutlinedInput
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00C3FE',
               
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff', // Warna outline saat hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4caf50', // Warna outline saat focus
                borderWidth: '2px',
              },
              backgroundColor: 'rgba(23, 32, 72, 0.7)', // Lebih transparan
              color: '#ffffff',
              '& input::placeholder': {
                color: '#cccccc', // Warna placeholder
                opacity: 1,
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                sx={{
                  color: '#ffffff', // Warna ikon
                }}
                  aria-label="toggle password visibility"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password Saat Ini"
          />
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <FormHelperText error>
              {formik.errors.currentPassword}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
        <InputLabel htmlFor="currentPassword"sx={{ color: "#f0f0f0f0",  '&.Mui-focused': {
        color: '#4caf50', // Warna label saat focus
      }, }}>Password Baru</InputLabel>
          <OutlinedInput
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00C3FE',
               
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff', // Warna outline saat hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4caf50', // Warna outline saat focus
                borderWidth: '2px',
              },
              backgroundColor: 'rgba(23, 32, 72, 0.7)', // Lebih transparan
              color: '#ffffff',
              '& input::placeholder': {
                color: '#cccccc', // Warna placeholder
                opacity: 1,
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                  sx={{ color: '#ffffff', }}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password Baru"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <FormHelperText error>
              {formik.errors.newPassword}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
        <InputLabel htmlFor="currentPassword"sx={{ color: "#f0f0f0f0",  '&.Mui-focused': {
        color: '#4caf50', // Warna label saat focus
      }, }}>Konfirmasi Password Baru</InputLabel>
          <OutlinedInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00C3FE',
               
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff', // Warna outline saat hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4caf50', // Warna outline saat focus
                borderWidth: '2px',
              },
              backgroundColor: 'rgba(23, 32, 72, 0.7)', // Lebih transparan
              color: '#ffffff',
              '& input::placeholder': {
                color: '#cccccc', // Warna placeholder
                opacity: 1,
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                sx={{ color: '#ffffff', }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Konfirmasi Password Baru"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <FormHelperText error>
              {formik.errors.confirmPassword}
            </FormHelperText>
          )}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Memproses...' : 'Ganti Password'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ChangePasswordForm;