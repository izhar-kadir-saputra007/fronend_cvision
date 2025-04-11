import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuestionNavigation from "../components/rekrutmen/pisikotes/QuestionNavigation";
import QuestionCard from "../components/rekrutmen/pisikotes/QuestionCard";
import Timer from "../components/rekrutmen/pisikotes/Timer";
import JenisSoalSelector from "../components/rekrutmen/pisikotes/JenisSoalSelector";

const PsikotestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [lamaranId, setLamaranId] = useState(
    location.state?.lamaranId || localStorage.getItem('lamaranId') || null
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedJenisSoal, setSelectedJenisSoal] = useState(null);
  const token = localStorage.getItem("token");

  // Simpan lamaranId ke localStorage saat pertama kali dimuat
  useEffect(() => {
    if (location.state?.lamaranId) {
      localStorage.setItem('lamaranId', location.state.lamaranId);
      setLamaranId(location.state.lamaranId);
    }
  }, [location.state]);

  // Inisialisasi test dari localStorage
  useEffect(() => {
    const initializeTest = async () => {
      try {
        // Ambil durasi timer dari API
        const timerResponse = await axios.get(
          "http://localhost:3000/api/getTimerDuration",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimerDuration(timerResponse.data.timerDuration * 60);

        // Pulihkan state dari localStorage
        const savedJenisSoal = localStorage.getItem("selectedJenisSoal");
        const savedIsStarted = localStorage.getItem("isStarted") === "true";
        const savedIsFinished = localStorage.getItem("isFinished") === "true";
        const savedAnswers = localStorage.getItem("savedAnswers");
        const savedScore = localStorage.getItem("savedScore");
        const startTime = localStorage.getItem("startTime");
        const savedCurrentQuestionIndex = Number(localStorage.getItem("currentQuestionIndex"));
        const savedQuestions = localStorage.getItem("questions");

        if (savedJenisSoal) setSelectedJenisSoal(savedJenisSoal);
        if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers);
          const filledAnswers = parsedAnswers.map((answer) => 
            answer === null ? { answer: "", score: 0 } : answer
          );
          setAnswers(filledAnswers);
          localStorage.setItem("savedAnswers", JSON.stringify(filledAnswers));
        }
        if (savedScore !== null) setScore(Number(savedScore));

        // Lanjutkan test yang belum selesai
        if (savedIsStarted && !savedIsFinished && startTime) {
          const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
          const remainingTime = timerResponse.data.timerDuration * 60 - elapsed;

          if (remainingTime > 0) {
            setTimer(remainingTime);
            setIsStarted(true);
            setIsFinished(false);
            setHasSubmitted(false);
            if (!isNaN(savedCurrentQuestionIndex) && savedCurrentQuestionIndex >= 0) {
              setCurrentQuestionIndex(savedCurrentQuestionIndex);
            }
          } else {
            await handleTestTimeout();
          }
        } else if (savedIsFinished) {
          setIsStarted(false);
          setIsFinished(true);
          setHasSubmitted(true);
          setTimer(0);
        } else {
          resetTest();
        }
      } catch (error) {
        console.error("Failed to initialize test:", error);
      }
    };

    initializeTest();
  }, [token]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0 && isStarted && !hasSubmitted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("timer", newTimer.toString());
          if (newTimer === 0) handleTestTimeout();
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isStarted, hasSubmitted]);

  const handleTestTimeout = async () => {
    setTimer(0);
    setIsStarted(false);
    if (!hasSubmitted) await submitAnswers();
  };

  const resetTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setHasSubmitted(false);
    setScore(null);
    setAnswers([]);
    setTimer(0);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedJenisSoal(null);
    
    // Bersihkan localStorage
    const keysToRemove = [
      "questions", "answers", "savedAnswers", "savedScore",
      "isFinished", "hasSubmitted", "timer", "startTime",
      "currentQuestionIndex",
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.setItem("isStarted", "false");
  };

  const handleStart = async (jenisSoalId) => {
    setSelectedJenisSoal(jenisSoalId);
    localStorage.setItem("selectedJenisSoal", jenisSoalId);
    resetTest();
    setIsStarted(true);
    localStorage.setItem("isStarted", "true");
    localStorage.setItem("startTime", Date.now().toString());
    await fetchQuestions(jenisSoalId);
    setTimer(timerDuration);
  };

  const fetchQuestions = async (jenisSoalId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getSoalPsikotesByJenisSoalId/${jenisSoalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.data) {
        setQuestions(response.data.data);
        const initialAnswers = response.data.data.map(() => ({ answer: "", score: 0 }));
        setAnswers(initialAnswers);
        localStorage.setItem("questions", JSON.stringify(response.data.data));
        localStorage.setItem("answers", JSON.stringify(initialAnswers));
      }
    } catch (error) {
      console.error("Gagal memuat soal psikotes:", error);
      alert("Gagal memuat soal. Silakan coba lagi.");
    }
  };

  const handleAnswerChange = (index, { answer, score }) => {
    if (!isFinished && !hasSubmitted) {
      const newAnswers = [...answers];
      newAnswers[index] = { answer, score };
      setAnswers(newAnswers);
      localStorage.setItem("savedAnswers", JSON.stringify(newAnswers));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem("currentQuestionIndex", newIndex.toString());
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      localStorage.setItem("currentQuestionIndex", newIndex.toString());
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
    localStorage.setItem("currentQuestionIndex", index.toString());
  };

  const handleSubmit = async () => {
    if (timer > 0) {
      const confirmSubmit = window.confirm("Apakah Anda yakin untuk mengakhiri tes?");
      if (!confirmSubmit) return;
    }
    await handleTestTimeout();
  };

  const submitAnswers = async () => {
    if (!hasSubmitted) {
      try {
        // Gunakan selectedJenisSoal dari state atau localStorage
        const jenisSoalId = selectedJenisSoal || localStorage.getItem("selectedJenisSoal");
        if (!jenisSoalId) throw new Error("Jenis soal tidak valid.");

        const formattedAnswers = questions.map((question, index) => ({
          soalPsikotesId: question.id,
          jawaban: answers[index]?.answer || null,
          skor: answers[index]?.score || 0,
        }));

        const endpoint = lamaranId 
          ? `http://localhost:3000/api/submitBulkJawabanPsikotes/${jenisSoalId}/${lamaranId}`
          : `http://localhost:3000/api/submitBulkJawabanPsikotes/${jenisSoalId}`;

        const response = await axios.post(endpoint, formattedAnswers, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          // Update state tanpa menghapus selectedJenisSoal
          setIsStarted(false);
          setIsFinished(true);
          setHasSubmitted(true);
          setScore(response.data.data.totalSkor);
          setRefreshKey(prev => prev + 1);
          
          // Bersihkan localStorage TAPI pertahankan selectedJenisSoal
          const keysToRemove = [
            "questions", "answers", "savedAnswers", "savedScore",
            "isFinished", "hasSubmitted", "timer", "startTime",
            "currentQuestionIndex"
          ];
          
          keysToRemove.forEach(key => localStorage.removeItem(key));
          localStorage.setItem("isStarted", "false");

          // Jika semua tes selesai, redirect
          if (lamaranId && response.data.data.isAllTestsCompleted) {
            localStorage.removeItem('lamaranId');
            setTimeout(() => navigate('/lamaranuser'), 1000);
          }
        }
      } catch (error) {
        console.error("Gagal mengirim jawaban:", error);
        alert("Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-color1">Psychotest</h1>
        {!isStarted && !isFinished ? (
          <JenisSoalSelector 
            onStartTest={handleStart} 
            lamaranId={lamaranId}
            key={`${lamaranId}_${refreshKey}`}
          />
        ) : isStarted ? (
          <>
            <Timer timer={timer} />
            <div className="flex flex-row gap-10">
              <QuestionNavigation
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                handleQuestionNavigation={handleQuestionNavigation}
                handleSubmit={handleSubmit}
                hasSubmitted={hasSubmitted}
              />
              {questions.length > 0 && (
                <QuestionCard
                  question={questions[currentQuestionIndex] || { pertanyaan: "", options: [] }}
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  answers={answers}
                  handleAnswerChange={handleAnswerChange}
                  isFinished={isFinished}
                  hasSubmitted={hasSubmitted}
                  handleBack={handleBack}
                  handleNext={handleNext}
                />
              )}
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

export default PsikotestPage;