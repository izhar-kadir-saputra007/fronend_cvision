import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import PieChartUmum from "../components/PieChartUmum";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UmumTestPage = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const savedPrediction = localStorage.getItem("predictionUmum");
    if (savedPrediction) {
      setPrediction(JSON.parse(savedPrediction));
    }
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/validateToken`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      
      if (response.data.valid && response.data.user) {
        setUserInfo(response.data.user);
        setIsPremium(response.data.user.isPremium);
      }
    } catch (err) {
      console.error("Error checking user status:", err);
      setIsPremium(false);
      setUserInfo(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setPrediction(null);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);
  
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        throw new Error("Silakan unggah file CV Anda.");
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/predictCVUmum`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      
      if (response.data.user) {
        setUserInfo(response.data.user);
        setIsPremium(response.data.user.isPremium);
      }
  
      setPrediction({
        predicted_category: response.data.prediction.posisi,
        probability: response.data.prediction.probability,
        probabilities: response.data.prediction.top_5_positions,
      });
  
      localStorage.setItem(
        "predictionUmum",
        JSON.stringify({
          predicted_category: response.data.prediction.posisi,
          probability: response.data.prediction.probability,
          probabilities: response.data.prediction.top_5_positions,
        })
      );
    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 401) {
        setError("Silakan login terlebih dahulu untuk menggunakan fitur ini.");
      } else {
        setError(
          err.response?.data?.error ||
            "Terjadi kesalahan saat memproses permintaan Anda."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        backgroundColor: '#070F2B', 
        minHeight: '100vh',
        pt: 15,
        pb: 10
      }}>
        <Container maxWidth="md">
          {/* Header Section */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            px: 2
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#00C3FE',
                mb: 2
              }}
            >
              CV ATS Checker Gratis
            </Typography>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                color: '#9290C3',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Tool gratis membantu Anda memeriksa apakah CV Anda dioptimalkan
              untuk applicant tracking systems (ATS).
            </Typography>
          </Box>

          {/* Upload Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              backgroundColor: '#070F2B',
              boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)",
              p: 4, 
              mb: 4,
              
              borderRadius: 8
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 3
              }}>
                <Paper 
                  variant="outlined" 
                  sx={{
                    p: 4,
                    border: '2px dashed #00C3FE',
                    width: '100%',
                    backgroundColor: '#070F2B',
                    maxWidth: 500,
                    textAlign: 'center',
                 
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 50, color: '#00C3FE', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#535C91', mb: 2 }}>
                    {fileName || "Upload file atau drag and drop"}
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      backgroundColor: '#535C91',
                      '&:hover': {
                        backgroundColor: '#172048',
                      }
                    }}
                  >
                    Pilih File CV
                    <VisuallyHiddenInput 
                      id="cv-upload" 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                    />
                  </Button>
                  <Typography variant="caption" sx={{ color: '#9290C3', mt: 2, display: 'block' }}>
                    PDF CV ATS hingga 5MB
                  </Typography>
                </Paper>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !file}
                  sx={{
                    backgroundColor: '#00C3FE',
                    color: '#070F2B',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: 50,
                    '&:hover': {
                      backgroundColor: '#00a8d9',
                    },
                    '&:disabled': {
                      backgroundColor: '#9290C3',
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} />
                      Memproses...
                    </>
                  ) : 'Prediksi Sekarang'}
                </Button>
              </Box>
            </form>
          </Paper>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Result Section */}
          {prediction && (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 4,
      mt: 4,
      mb: 4,
      borderRadius: 2,
      backgroundColor: '#070F2B',
      boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)",
    }}
  >
    <Box sx={{ 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Typography 
        variant="h4" 
        component="h3" 
        sx={{ 
          fontWeight: 'bold', 
          color: 'white',
          mb: 2
        }}
      >
        Hasil Prediksi CV Anda
      </Typography>
      
      <Card 
        variant="outlined"
        sx={{ 
          mb: 3,
          bgcolor: '#070F2B',
          borderColor: '#00C3FE'
        }}
      >
        <CardContent sx={{ py: 3 }}>
          <Typography variant="h5" component="div" sx={{ mb: 1, color: '#00C3FE' }}>
            <strong>Kategori Prediksi:</strong>
          </Typography>
          <Chip 
            label={prediction.predicted_category}
            sx={{ 
              backgroundColor: '#00FF9C',
              color: '#070F2B',
              fontSize: '1.1rem',
              p: 2,
              mb: 1
            }}
          />
          {isPremium && (
            <Typography variant="h6" sx={{ mt: 1, color: '#E9EDFF' }}>
              Tingkat Kecocokan: {prediction.probability}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Premium Content */}
      {isPremium && prediction.probabilities && typeof prediction.probabilities === "object" && (
       <Box sx={{ width: '100%' }}>
       {/* Top 5 Posisi - Selalu di atas */}
       <Box sx={{ 
         width: '100%',
         mb: 3,
         p: 2,
         backgroundColor: '#E9EDFF',
         borderRadius: 2,
         boxShadow: 1
       }}>
         <Typography variant="h6" sx={{ 
           mb: 2, 
           color: '#535C91',
           textAlign: 'center'
         }}>
           Top 5 Posisi
         </Typography>
         {Object.entries(prediction.probabilities).map(([key, value]) => (
           <Box key={key} sx={{ mb: 2 }}>
             <Typography sx={{ 
               color: '#070F2B',
               display: 'flex',
               justifyContent: 'space-between'
             }}>
               <span>{key}:</span> 
               <strong>{value}</strong>
             </Typography>
             <Divider sx={{ 
               my: 1,
               borderColor: '#00C3FE',
               opacity: 0.5
             }} />
           </Box>
         ))}
       </Box>
     
       {/* Chart - Menempati seluruh lebar di bawahnya */}
       <Box sx={{ width: '100%' }}>
         <PieChartUmum
           probabilities={{
             [prediction.predicted_category]: prediction.probability,
             ...prediction.probabilities,
           }}
         />
       </Box>
     </Box>
      )}

      {/* Upgrade Message */}
      {!isPremium && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: '#FFE100',
              color: '#070F2B'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              <strong>Upgrade ke Premium</strong>
            </Typography>
            <Typography>
              Untuk melihat detail probability dan grafik perbandingan posisi lainnya, 
              silakan upgrade ke akun Premium.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  </Paper>
)}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default UmumTestPage;