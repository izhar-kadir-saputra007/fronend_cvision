import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [passedUsers, setPassedUsers] = useState([]); // Menyimpan data pengguna yang lulus
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(""); // Menyimpan error jika ada
  const token = localStorage.getItem("token"); // Mengambil token dari localStorage

  // Mengambil data pengguna yang lulus dari API
  useEffect(() => {
    const fetchPassedUsers = async () => {
      try {
        if (!token) {
          setError("Authorization token is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/usersPassed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Mencetak response untuk melihat data yang diterima
        console.log("API Response:", response);

        // Menyimpan data pengguna yang lulus
        setPassedUsers(response.data || []);
        setLoading(false);
      } catch (err) {
        setError("Error fetching passed users.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPassedUsers();
  }, [token]);

  return (
    <div className="flex gap-20">
      <SideBar />
      <div>
      <div className=" flex-1 p-6 shadow-custom5 ">
        <h1 className="text-3xl font-semibold mb-6 text-color1">Admin Dashboard</h1>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-center text-xl text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-xl text-red-500">{error}</p>
        ) : (
          <div className="p-4 bg-white shadow-merah rounded-lg ">
            {passedUsers.length > 0 ? (
              passedUsers.map((user) => (
                <div key={user.id} className="mb-4 p-4 border border-secondary rounded-lg">
                  <h2 className="font-semibold text-lg text-color1">{user.name}</h2>
                  <p className="text-secondary">Email: {user.email}</p>
                  <p className="text-secondary">Phone Number: {user.phoneNumber}</p>
                  <p className="text-secondary">Status: <span className="text-hijau">memenuhi kriteria</span></p>
                  <p className="text-color3 text-sm">Created at: {new Date(user.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-gray-600">No passed users found.</p>
            )}
          </div>
        )}
      </div>
                  </div>
    </div>
  );
};

export default AdminDashboard;
