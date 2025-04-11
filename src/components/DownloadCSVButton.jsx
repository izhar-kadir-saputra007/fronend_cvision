const DownloadCSVButton = ({ type }) => {
    const handleDownload = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/downloadCSV/${type}`);
        
        if (!response.ok) throw new Error("Gagal mengunduh file!");
  
        // 🔹 Ambil Blob dari respons dan buat URL untuk di-download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        // 🔹 Buat elemen <a> untuk mengunduh file
        const a = document.createElement("a");
        a.href = url;
        a.download = `prediksi_${type}.csv`;  // Nama file yang didownload
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("❌ Error saat mengunduh:", error);
      }
    };
  
    return (
      <button onClick={handleDownload} className="px-4 py-2 bg-merah text-color1 rounded-md">
        Download CSV ({type === "above_60" ? "≥60%" : "<60%"})
      </button>
    );
  };
  
  export default DownloadCSVButton;