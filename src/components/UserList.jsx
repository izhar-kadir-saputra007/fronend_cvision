import { useEffect, useState } from "react";
import axios from "axios";
import { setupLordIcon } from "../components/setupLordIcon";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [hovered, setHovered] = useState({});

  // Menghapus status hover dari localStorage dan mengatur ulang state saat halaman dimuat
  useEffect(() => {
    // Hapus hoverStatus dari localStorage
    localStorage.removeItem("hoverStatus");
    setHovered({}); // Reset state hovered ke objek kosong
  }, []);

  // Menangani mouse enter untuk hover pertama kali
  const handleMouseEnter = (resumeId) => {
    if (!hovered[resumeId]) {
      setHovered((prev) => {
        const newHovered = { ...prev, [resumeId]: true };
        localStorage.setItem("hoverStatus", JSON.stringify(newHovered)); // Simpan status hover di localStorage
        return newHovered;
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError(
          error.response ? error.response.data.msg : "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Setup LordIcons
    setupLordIcon();
  }, []);

  // Tampilkan pesan loading jika masih memuat
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleDownload = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/downloadPDF/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengunduh file:", error);
    }
  };

  const handleSendReport = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:3000/api/send-whatsapp-report/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.msg);
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      alert(error.response.data.msg);
    }
  };

  // Logika pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage * usersPerPage < users.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="border-2 border-secondary max-w-fit rounded-3xl overflow-hidden shadow-custom3 p-20">
        <h1 className="text-3xl text-secondary font-bold pb-2">
          Daftar Pengguna
        </h1>
        <table className="">
          <thead className="text-primary">
            <tr className="bg-secondary">
              {/* <th className="border-l-2 border-secondary border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-2">
                <div>
                
                  <lord-icon
                    src="https://cdn.lordicon.com/fjvfsqea.json"
                    trigger="loop" // trigger hover setelah animasi pertama selesai
                    state="loop"
                    colors="primary:##070F2B,secondary:#ffe100"
                    style={{}}
                  ></lord-icon>
                </div>
                ID
              </th> */}

              <th className="border-l-2 border-secondary border-r-2 border-r-primary border-b-2 border-b-color1">
                Role
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/kdduutaw.json"
                    trigger="loop"
                    state="morph-group"
                    delay="1500"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Nama
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5-">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/nzixoeyk.json"
                    trigger="loop"
                    delay="1500"
                    state="in-email"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Email
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5">
                <div>
                  {/* Memuat lord-icon dengan animasi pertama kali hanya dijalankan sekali */}
                  <lord-icon
                    src="https://cdn.lordicon.com/pmivedvy.json"
                    trigger="loop"
                    colors="primary:#070F2B,secondary:#070F2B"
                    style={{}}
                  ></lord-icon>
                </div>
                Nomor Telepon
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/lyrrgrsl.json"
                    trigger="loop"
                    delay="1500"
                    state="morph-group"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                CV
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/ppyvfomi.json"
                    trigger="loop"
                    delay="1500"
                    state=""
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Job
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5">
              <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/rguiapej.json"
                    trigger="loop"
                    delay="1500"
                    state="morph-group"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Probability
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/zrtfxghu.json"
                    trigger="loop"
                    state="morph-group"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Score Psikotes
              </th>
              <th className="border-r-2 border-r-primary border-b-2 border-b-color1 px-7 py-5">
                <div>
                  <lord-icon
                    src="https://cdn.lordicon.com/abfverha.json"
                    trigger="loop"
                    delay="2000"
                    state=""
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Date
              </th>
              <th className="border-b-2 border-b-color1 px-7 py-5">
              <div>
                  <lord-icon
                      src="https://cdn.lordicon.com/vpbspaec.json"
                      trigger="loop"
                      state="loop-flying"
                    colors="primary:#070f2b,secondary:#070f2b"
                    style={{}}
                  ></lord-icon>
                </div>
                Aksi</th>
            </tr>
          </thead>

          <tbody className="text-color2">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                {/* <td className="border-2 border-secondary px-4 py-">
                  {user.id}
                </td> */}
                <td className="border-2 border-secondary px-4 py-">
                  {user.role}
                </td>
                <td className="border-2 border-secondary px-4 py-">
                  {user.name}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.email}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.phoneNumber}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.resumes && user.resumes.length > 0
                    ? user.resumes.map((resume) => (
                        <div key={resume.id}>
                          <p>
                            {resume.file_name || "Nama file tidak tersedia"}
                          </p>
                          <div>
                            <button
                              onClick={() => handleDownload(resume.id)}
                              className="text-secondary underline cursor-pointer"
                              onMouseEnter={() => handleMouseEnter(resume.id)}
                            >
                              {hovered[resume.id] ? (
                                <lord-icon
                                  src="https://cdn.lordicon.com/rbbnmpcf.json"
                                  trigger="in"
                                  state=""
                                  colors="primary:#00C3FE"
                                  style={{ width: "50px" }}
                                  // Menambahkan onAnimationEnd untuk mengembalikan teks
                                ></lord-icon>
                              ) : (
                                "Download di sini"
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.resumes.length > 0
                    ? user.resumes.map((resume) => (
                        <div key={resume.id}>
                          <p>{resume.predicted_category}</p>
                          {/* Job (predicted category) */}
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.resumes.length > 0
                    ? user.resumes.map((resume) => (
                        <div key={resume.id}>
                          <p>{resume.probability}%</p> {/* Probability */}
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.hasilPsikotests.length > 0
                    ? user.hasilPsikotests.map((hasil) => (
                        <div key={hasil.id}>
                          <p>{hasil.totalScore}</p> {/* Score Psikotes */}
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {user.hasilPsikotests.length > 0
                    ? user.hasilPsikotests.map((hasil) => (
                        <div key={hasil.id}>
                          <p>{new Date(hasil.date).toLocaleDateString()}</p>
                          {/* Date */}
                        </div>
                      ))
                    : "-"}
                </td>

                <td className="border-2 border-secondary px-4 py-">
                  {/* <button
                    onClick={() => handleSendReport(user.id)}
                    className="text-color1 underline"
                  >
                    Kirim Laporan
                  </button> */}
                  <button
                              onClick={() => handleSendReport(user.id)}
                              className="text-color1 underline cursor-pointer"
                              onMouseEnter={() => handleMouseEnter(user.id)}
                            >
                              {hovered[user.id] ? (
                                <lord-icon
                                src="https://cdn.lordicon.com/vpbspaec.json"
                                trigger="hover"
                                delay="1500"
                                state="in-assembly"
                                  colors="primary:#FFE100"
                                  style={{ width: "50px" }}
                                  // Menambahkan onAnimationEnd untuk mengembalikan teks
                                ></lord-icon>
                              ) : (
                                "kirim laporan"
                              )}
                            </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination text-color1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Sebelumnya
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * usersPerPage >= users.length}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
