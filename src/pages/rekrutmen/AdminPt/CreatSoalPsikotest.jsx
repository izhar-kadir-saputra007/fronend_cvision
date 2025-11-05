import { useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import CreateJenisSoal from "../../../components/rekrutmen/adminPT/CreateJenisSoal";
import CreateSoalPsikotes from "../../../components/rekrutmen/adminPT/CreateSoalPsikotes";

const CreatSoalPsikotest = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', }}>
      <Box sx={{ mb: 4, bgroundColor: '#070F2B', borderRadius: 8,  }}>
        <h1 className="text-3xl text-color2">Soal Psikotest</h1>
        <p className="text-color2">Kelola soal psikotest perusahaan</p>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: '#00C3FE', color: '#00C3FE', 
      }}>
     <Tabs
  value={activeTab}
  onChange={handleTabChange}
  aria-label="basic tabs example"
  variant="fullWidth"
  TabIndicatorProps={{ style: { backgroundColor: '#00C3FE' } }}
  sx={{ backgroundColor: '#070F2B' }}
>
  <Tab 
    label="Buat Soal Psikotes" 
    sx={{ 
      color: '#888', // Warna default
      '&.Mui-selected': { color: '#00C3FE', fontWeight: 'bold' }
    }} 
  />
  <Tab 
    label="Buat Jenis Soal" 
    sx={{ 
      color: '#888', // Warna default
      '&.Mui-selected': { color: '#00C3FE', fontWeight: 'bold' }
    }} 
  />
</Tabs>

</Box>
      <Box sx={{ p: 10, boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)"  }}>
        {activeTab === 0 && (
          <Box>
            <CreateSoalPsikotes />
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <CreateJenisSoal />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CreatSoalPsikotest;