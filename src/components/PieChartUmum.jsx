import * as React from 'react';
import { PieChart, BarChart } from '@mui/x-charts';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

const PieChartUmum = ({ probabilities }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  
  // Menambahkan event listener untuk memantau ukuran layar
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validasi data
  if (!probabilities || typeof probabilities !== "object") {
    return (
      <Box sx={{ 
        border: '2px solid #00C3FE',
        backgroundColor: '#070F2B',
        color: '#E9EDFF',
        p: 2,
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <p>Tidak ada data probabilitas yang valid.</p>
      </Box>
    );
  }

  // Format data untuk MUI Charts
  const chartData = Object.entries(probabilities).map(([label, value]) => {
    let numericValue = 0;
    if (typeof value === "string") {
      numericValue = parseFloat(value.replace("%", ""));
    } else if (typeof value === "number") {
      numericValue = value;
    }
    return { 
      label, 
      value: numericValue,
      id: label.toLowerCase().replace(/\s+/g, '-')
    };
  });

  // Warna sesuai palet Anda
  const colors = ['#00C3FE', '#FFE100', '#00FF9C', '#FF204E', '#9290C3'];

  // Komponen untuk label di tengah pie chart
  const PieCenterLabel = ({ children }) => {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  };

  const StyledText = styled('text')({
    fill: '#E9EDFF',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
    fontWeight: 'bold',
  });

  // Menentukan ukuran chart berdasarkan ukuran layar
  const isSmallScreen = windowWidth < 768;
  const pieChartSize = isSmallScreen ? 260 : 300;
  const barChartWidth = isSmallScreen ? 280 : 350;
  const barChartHeight = isSmallScreen ? 260 : 300;

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              border: '2px solid #00C3FE',
              backgroundColor: '#00C3FE',
              p: 2,
              borderRadius: 2,
              height: '100%',
              minHeight: isSmallScreen ? '300px' : '350px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#E9EDFF',
                mb: 2,
                textAlign: 'center'
              }}>
                Distribusi Probabilitas
              </Typography>
              <Box sx={{ 
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <PieChart
                  series={[{
                    data: chartData,
                    innerRadius: pieChartSize * 0.15,
                    outerRadius: pieChartSize * 0.3,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    highlightScope: { faded: 'global', highlight: 'item' },
                    faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 20,
                    colors: colors,
                  }]}
                  width={pieChartSize}
                  height={pieChartSize}
                  margin={{ right: 5, left: 5, top: 5, bottom: 5 }}
                  slotProps={{
                    legend: { hidden: true }
                  }}
                >
                  <PieCenterLabel>Total</PieCenterLabel>
                </PieChart>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ 
              border: '2px solid #00C3FE',
              backgroundColor: '#070F2B',
              p: 2,
              borderRadius: 2,
              height: '100%',
              minHeight: isSmallScreen ? '300px' : '350px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#E9EDFF',
                mb: 2,
                textAlign: 'center'
              }}>
                Perbandingan Probabilitas
              </Typography>
              <Box sx={{ 
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: chartData.map(item => {
                      // Memotong label yang terlalu panjang untuk menghindari overflow
                      const maxLength = isSmallScreen ? 8 : 12;
                      return item.label.length > maxLength ? 
                             item.label.substring(0, maxLength) + '...' : 
                             item.label;
                    }),
                    label: 'Kategori',
                    labelStyle: { fontSize: 12, fill: '#E9EDFF' },
                    tickLabelStyle: { 
                      fontSize: isSmallScreen ? 8 : 10, 
                      fill: '#E9EDFF',
                      textAnchor: isSmallScreen ? 'end' : 'middle',
                      transform: isSmallScreen ? 'rotate(-45)' : 'rotate(0)',
                      dx: isSmallScreen ? -8 : 0
                    },
                  }]}
                  yAxis={[{
                    label: 'Probabilitas (%)',
                    labelStyle: { fontSize: 12, fill: '#E9EDFF' },
                    tickLabelStyle: { fontSize: 10, fill: '#E9EDFF' },
                    max: Math.ceil(Math.max(...chartData.map(item => item.value)) * 1.2), // Memberi ruang di atas bar
                  }]}
                  series={[{
                    data: chartData.map(item => item.value),
                  
                    valueFormatter: (value) => `${value}%`,
                  }]}
                  width={barChartWidth}
                  height={barChartHeight}
                  colors={['#00C3FE']}
                  margin={{ 
                    left: 70, 
                    right: 20, 
                    top: 20, 
                    bottom: isSmallScreen ? 60 : 40 
                  }}
                  slotProps={{
                    legend: { hidden: true }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Informasi Tambahan */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ 
          border: '2px solid #00C3FE',
          backgroundColor: '#070F2B',
          p: 3,
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ 
            color: '#E9EDFF',
            mb: 2,
            textAlign: 'center'
          }}>
            Analisis Lanjutan
          </Typography>
          <Grid container spacing={2}>
            {[
              { 
                title: 'Kategori Tertinggi', 
                value: chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]).label,
                color: '#00C3FE'
              },
              { 
                title: 'Probabilitas Maks', 
                value: `${Math.max(...chartData.map(item => item.value))}%`,
                color: '#00FF9C'
              },
              { 
                title: 'Probabilitas Min', 
                value: `${Math.min(...chartData.map(item => item.value))}%`, 
                color: '#FF204E'
              },
              { 
                title: 'Rata-rata', 
                value: `${(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(1)}%`,
                color: '#FFE100'
              }
            ].map((item, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Box sx={{ 
                  backgroundColor: '#535C91',
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Typography variant="body2" sx={{ color: '#E9EDFF' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: item.color,
                    fontWeight: 'bold',
                    // Mengurangi ukuran font untuk nilai yang panjang atau pada layar kecil
                    fontSize: isSmallScreen || item.value.length > 15 ? '0.9rem' : '1.25rem',
                    // Memungkinkan pemisahan kata jika terlalu panjang
                    wordBreak: 'break-word'
                  }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default PieChartUmum;