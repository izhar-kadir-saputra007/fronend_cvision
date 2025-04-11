import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const PieChartUmum = ({ probabilities }) => {
  // Pastikan probabilities adalah object dan tidak null/undefined
  if (!probabilities || typeof probabilities !== "object") {
    return <p>No valid probabilities data available.</p>;
  }

  // Data untuk Pie Chart
  const pieData = {
    labels: Object.keys(probabilities), // Label kategori
    datasets: [
      {
        label: "Job Category Probabilities (%)",
        data: Object.values(probabilities).map((prob) => {
          if (typeof prob === "string") {
            return parseFloat(prob.replace("%", "")); // Hapus "%" dan konversi ke angka
          }
          return 0; // Jika bukan string, kembalikan 0 atau nilai default
        }),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#C9CBCF", "#B9E28C", "#7FDBFF", "#D7BDE2",
          "#F5B7B1", "#76D7C4", "#D98880", "#ABB2B9", "#3498DB",
          "#E67E22", "#2ECC71", "#D35400", "#5D6D7E", "#F1C40F",
          "#E74C3C", "#1ABC9C", "#9B59B6", "#34495E", "#16A085"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data untuk Bar Chart
  const barData = {
    labels: Object.keys(probabilities), // Label kategori
    datasets: [
      {
        label: "Job Category Probabilities (%)",
        data: Object.values(probabilities).map((prob) => {
          if (typeof prob === "string") {
            return parseFloat(prob.replace("%", "")); // Hapus "%" dan konversi ke angka
          }
          return 0; // Jika bukan string, kembalikan 0 atau nilai default
        }),
        backgroundColor: "#36A2EB", // Warna bar
        borderColor: "#36A2EB", // Warna border bar
        borderWidth: 1,
      },
    ],
  };

  // Opsi untuk Pie Chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#E9EDFF", // Warna teks legenda
          font: {
            size: 14, // Ukuran font legenda
          },
        },
      },
      tooltip: {
        enabled: true,
        bodyColor: "#FFE100", // Warna teks body tooltip
        titleColor: "#00C3FE", // Warna teks judul tooltip
        titleFont: {
          size: 16, // Ukuran font judul tooltip
        },
      },
    },
  };

  // Opsi untuk Bar Chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Sembunyikan legenda
      },
      tooltip: {
        enabled: true,
        bodyColor: "#FFE100", // Warna teks body tooltip
        titleColor: "#00C3FE", // Warna teks judul tooltip
        titleFont: {
          size: 16, // Ukuran font judul tooltip
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Sembunyikan grid sumbu X
        },
        ticks: {
          color: "#E9EDFF", // Warna teks label sumbu X
          font: {
            size: 14, // Ukuran font label sumbu X
          },
        },
      },
      y: {
        grid: {
          color: "#E9EDFF", // Warna grid sumbu Y
        },
        ticks: {
          color: "#E9EDFF", // Warna teks label sumbu Y
          font: {
            size: 14, // Ukuran font label sumbu Y
          },
        },
      },
    },
    layout: {
      padding: {
        left: 20, // Padding kiri
        right: 20, // Padding kanan
      },
    },
    barPercentage: 0.6, // Lebar bar (60% dari lebar kategori)
    categoryPercentage: 0.8, // Jarak antar kategori (80% dari lebar kategori)
  };

  return (
    <div className="flex gap-19 p-5"> {/* Perbesar gap menjadi 16 unit */}
      {/* Pie Chart */}
      <div className="">
        <div className="" style={{ width: "400px", height: "400px" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="">
        <div className="" style={{ width: "350px", height: "400px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default PieChartUmum;