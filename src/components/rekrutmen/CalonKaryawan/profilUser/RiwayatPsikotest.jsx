import { useEffect, useState } from "react";
import axios from "axios";

const RiwayatPsikotest = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getTotalSkorUserPremium`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.data || !response.data.data) {
                    throw new Error("Data tidak ditemukan");
                }

                setData(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-secondary shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Total Skor Per Jenis Soal</h2>
            {data && Object.keys(data).map((jenisSoalId) => (
                <div key={jenisSoalId} className="mb-6">
                    <h3 className="text-lg font-semibold bg-gray-200 p-2 rounded">
                        Jenis Soal {jenisSoalId}: {data[jenisSoalId][0]?.namaJenisSoal || "Tidak Diketahui"}
                    </h3>
                    <ul className="list-disc pl-5">
                        {data[jenisSoalId].map((item, index) => (
                            <li key={index} className="py-1">
                                Skor: <span className="font-bold">{item.totalSkor}</span> - 
                                <span className="text-gray-500 text-sm ml-2">{new Date(item.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default RiwayatPsikotest;