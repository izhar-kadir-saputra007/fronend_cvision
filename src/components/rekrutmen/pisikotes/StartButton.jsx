const StartButton = ({ handleStart }) => {
  return (
    <button
      onClick={handleStart}
      className="bg-secondary text-white px-4 py-2 rounded"
    >
      Mulai Psikotest
    </button>
  );
};

export default StartButton;