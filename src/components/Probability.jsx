import { useState, useEffect } from "react";
import axios from "axios";

const Probability = () => {
  const [minProbability, setMinProbability] = useState(
    () => Number(localStorage.getItem("minProbability")) || 0
  );
  const [minScore, setMinScore] = useState(
    () => Number(localStorage.getItem("minScore")) || 0
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    localStorage.setItem("minProbability", minProbability);
  }, [minProbability]);

  useEffect(() => {
    localStorage.setItem("minScore", minScore);
  }, [minScore]);

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setTotalUsers(response.data.length);
      } else {
        setError("Invalid data structure received.");
      }
    } catch (error) {
      console.error("Error fetching total users:", error);
      setError("Failed to fetch total users. Please try again later.");
    }
    setLoading(false);
  };

  const fetchUsersByProbability = async () => {
    setLoading(true);
    setError(null);
    setUsers([]);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:3000/api/users/probability", {
        headers: { Authorization: `Bearer ${token}` },
        params: { minProbability, minScore }, // Mengirimkan minProbability dan minScore
      });
      if (Array.isArray(response.data)) {
        const modifiedUsers = response.data.map(user => ({
          ...user,
          resumes: user.resumes.slice(0, 1), // Hanya ambil resume pertama
          hasilPsikotests: user.hasilPsikotests.slice(0, 1), // Hanya ambil hasil psikotest pertama
        }));
        setUsers(modifiedUsers);
      } else {
        setError("Invalid data structure received.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    }
    setLoading(false);
  };

  const sendPassedUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      // Filter users who meet the passing criteria
      const passedUsers = users.filter(user => {
        const resume = user.resumes[0]; // Ambil resume pertama
        const psikotest = user.hasilPsikotests[0]; // Ambil hasil psikotest pertama
        return resume && psikotest && resume.probability >= minProbability && psikotest.totalScore >= minScore;
      });

      console.log("Passed users to be sent:", passedUsers); // Log the data being sent

      if (passedUsers.length > 0) {
        const response = await axios.post(
          "http://localhost:3000/api/sendPassedUsers", 
          { users: passedUsers, minScore, minProbability }, // Pastikan data dikirim dalam format yang benar
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Passed users data sent successfully:", response.data);
        setError("Data berhasil dikirim.");
      } else {
        setError("Tidak ada pengguna yang memenuhi kriteria lulus.");
      }
    } catch (error) {
      console.error("Error sending passed users:", error);
      if (error.response) {
        // If the error is from the server, log the response details
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        setError(`Error: ${error.response.data.message || 'Unknown error'}`);
      } else {
        setError("Failed to send passed users. Please try again later.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  useEffect(() => {
    fetchUsersByProbability();
  }, [minProbability, minScore]);

  return (
    <div className="text-color1 mt-4 mx-auto p-14 bg-white rounded-lg shadow-custom5">
      <div className="mb-4">
        {users.length > 0 ? (
          <p>{users.length} user ditemukan dari {totalUsers} total user.</p>
        ) : (
          !loading && !error && <p className="font-bold text-merah">Users tidak ditemukan!</p>
        )}
      </div>

      <label className="text-secondary">
        Minimun Probability CV:
        <input
          type="number"
          value={minProbability}
          onChange={(e) => setMinProbability(Number(e.target.value))}
          min="0"
          placeholder="Set minimum probability"
          className="ml-2 border p-1 rounded text-primary"
        />
      </label>

      <label className="text-secondary">
        Minimum Score Psychotest:
        <input
          type="number"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          min="0"
          placeholder="Set minimum score"
          className="ml-2 border p-1 rounded text-primary"
        />
      </label>

      <button onClick={fetchUsersByProbability} className="ml-4 text-secondary border rounded p-1">
        Fetch Users
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
      {Array.isArray(users) && users.length > 0 ? (
        <ul className="">
          {users.map((user) => (
            <li key={user.id} className="my-9">
              <p><strong>Name:</strong> <span className="text-secondary">{user.name}</span></p>
              <p><strong>Email:</strong> <span className="text-secondary">{user.email}</span></p>
              <p><strong>Phone Number:</strong> <span className="text-secondary">{user.phoneNumber}</span></p>

              {user.resumes && user.resumes.length > 0 ? (
                <div>
                  <p><strong>Probability:</strong> <span className="text-secondary">{user.resumes[0].probability}%</span></p>
                  <p><strong>Position:</strong> <span className="text-secondary">{user.resumes[0].predicted_category}</span></p>
                </div>
              ) : (
                <p>Resume belum tersedia.</p>
              )}

              {user.hasilPsikotests && user.hasilPsikotests.length > 0 ? (
                <div>
                  <p><strong>Psychotest Result:</strong></p>
                  <p className="text-secondary">- Score: {user.hasilPsikotests[0].totalScore}</p>
                  <p className="text-secondary">- Date: {new Date(user.hasilPsikotests[0].date).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-merah">Belum mengikuti ujian psikotest.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p className="font-bold text-merah">Users tidak ditemukan!</p>
      )}
      </div>

      <button
        onClick={sendPassedUsers}
        className="mt-4 text-primary bg-secondary p-2 rounded"
        disabled={loading}
      >
        Send Results
      </button>
    </div>
  );
};

export default Probability;
