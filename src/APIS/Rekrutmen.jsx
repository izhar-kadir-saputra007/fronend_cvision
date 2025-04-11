const API_URL = "http://localhost:5000";

export const fetchLowongan = async () => {
  const response = await fetch(`${API_URL}/lowongan`);
  return response.json();
};

export const applyForJob = async (formData) => {
  return { message: "Lamaran berhasil dikirim!" }; // Simulasi API
};

export const fetchPsikotest = async (id_lowongan) => {
  console.log("Fetching Psikotest untuk ID:", id_lowongan);
  if (!id_lowongan) return [];
  
  const response = await fetch(`${API_URL}/psikotest?id_lowongan=${id_lowongan}`);
  return response.json();
};

export const submitPsikotest = async ({ id_lowongan, answers }) => {
  console.log("Jawaban Psikotest:", answers);
  return { message: "Psikotest berhasil dikirim!" }; // Simulasi API
};
