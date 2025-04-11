import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PsychologyIcon from '@mui/icons-material/Psychology'; // New icon for psychotest
import { useNavigate } from 'react-router-dom';

export default function LamaranDropdown({ lamaranId }) {
  const [open, setOpen] = React.useState(false);
  const [progres, setProgres] = React.useState({
    applyLamaran: false,
    inputCV: false,
    psikoTest: false,
    hasil: false
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lamaranDetail, setLamaranDetail] = useState(null);
  const navigate = useNavigate();

  // Ambil detail lamaran saat komponen mount atau lamaranId berubah
  useEffect(() => {
    const fetchLamaranDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/getLamaranForUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Cari lamaran berdasarkan ID
        const currentLamaran = response.data.data.find(item => item.id === lamaranId);
        setLamaranDetail(currentLamaran);

        // Update progress berdasarkan response API
        if (currentLamaran) {
          setProgres({
            applyLamaran: true, // Selalu true karena user sudah apply
            inputCV: currentLamaran.resumeId !== null,
            psikoTest: currentLamaran.isFinishTest === true || currentLamaran.isFinishTest === 1,
            hasil: currentLamaran.status !== 'menunggu'
          });
        }
      } catch (error) {
        console.error('Gagal mengambil detail lamaran:', error);
      }
    };

    if (lamaranId) {
      fetchLamaranDetails();
    }
  }, [lamaranId]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadCV = async () => {
    if (!file) {
      alert('Pilih file CV terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `http://localhost:3000/api/upload-cv/${lamaranId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 201) {
        alert('CV berhasil diunggah.');
        // Refresh data lamaran setelah upload
        const token = localStorage.getItem('token');
        const updatedResponse = await axios.get(`http://localhost:3000/api/getLamaranForUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedLamaran = updatedResponse.data.data.find(item => item.id === lamaranId);
        setLamaranDetail(updatedLamaran);
        setProgres(prev => ({ ...prev, inputCV: true }));
      }
    } catch (error) {
      console.error('Gagal mengunggah CV:', error);
      alert('Terjadi kesalahan saat mengunggah CV.');
    } finally {
      setUploading(false);
    }
  };

  const handleTestClick = () => {
    if (!progres.psikoTest) {
      // Simpan lamaranId dan navigasi ke halaman psikotes
      localStorage.setItem('lamaranId', lamaranId);
      navigate('/psikotest', { state: { lamaranId } });
    }
  };

  return (
    <List
      className='bg-primary p-4 my-4 text-color2 border-color3 border-t-2'
      component="nav"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText 
          primary="Progres Lamaran" 
          sx={{ 
            textAlign: 'left',
            paddingLeft: 0,
          }} 
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Timeline position="alternate-reverse">
          {/* Tahap Apply Lamaran - Selalu selesai */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <CheckCircleIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body1" fontWeight="bold">
                Apply Lamaran
              </Typography>
              <Typography variant="body2" className='text-color3'>
                Tahap awal mengajukan lamaran.
              </Typography>
              <Typography variant="body2" color="success.main">
                  <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Selesai
                </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Tahap Input CV */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={progres.inputCV ? 'primary' : 'grey'}>
                {progres.inputCV && <CheckCircleIcon />}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: progres.inputCV ? 'primary.main' : 'grey.500' }} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body1" fontWeight="bold">
                Input CV
              </Typography>
              <Typography variant="body2" className='text-color3'>
                Unggah CV Anda untuk proses seleksi.
              </Typography>
              {!progres.inputCV && (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="upload-cv"
                  />
                  <label htmlFor="upload-cv">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '4px 4px',
                        fontSize: '0.6rem'
                      }}
                    >
                      {uploading ? 'Mengunggah...' : 'Pilih File'}
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    className="bg-color3 text-color2"
                    onClick={handleUploadCV}
                    disabled={!file || uploading}
                    sx={{ marginLeft: 2, textTransform: 'none', borderRadius: '8px', padding: '4px 4px', fontSize: '0.6rem'}}
                  >
                    {uploading ? 'Mengunggah...' : 'Unggah CV'}
                  </Button>
                </div>
              )}
              {progres.inputCV && (
                 <Typography variant="body2" color="success.main">
                 <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                 Selesai
               </Typography>
              )}
            </TimelineContent>
          </TimelineItem>

          {/* Tahap Psikotes - Improved with Button */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={progres.psikoTest ? 'primary' : 'grey'}>
                {progres.psikoTest && <CheckCircleIcon />}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: progres.psikoTest ? 'primary.main' : 'grey.500' }} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body1" fontWeight="bold">
                Tes Psikotes
              </Typography>
              <Typography variant="body2" className='text-color3' sx={{ mb: 1 }}>
                Lengkapi tes psikotes untuk melanjutkan proses.
              </Typography>
              {progres.psikoTest ? (
                <Typography variant="body2" color="success.main">
                  <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Selesai
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PsychologyIcon />}
                  onClick={handleTestClick}
                  sx={{
                    mt: 1,
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '4px 4px',
                    fontSize: '0.6rem'
                  }}
                >
                  Mulai Tes Psikotes
                </Button>
              )}
            </TimelineContent>
          </TimelineItem>

          {/* Tahap Hasil */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={progres.hasil ? 'primary' : 'grey'}>
                {progres.hasil && <CheckCircleIcon />}
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body1" fontWeight="bold">
                Hasil
              </Typography>
              <Typography variant="body2" className='text-color3'>
                Lihat hasil seleksi lamaran.
              </Typography>
              {progres.hasil ? (
                <Typography variant="body2" color="primary">
                  Selesai
                </Typography>
              ) : (
                <Typography variant="body2" className='text-color1'>
                  Menunggu hasil seleksi
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Collapse>
    </List>
  );
}