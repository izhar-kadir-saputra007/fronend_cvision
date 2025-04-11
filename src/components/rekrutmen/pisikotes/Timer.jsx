const Timer = ({ timer }) => {
  return (
    <p className="text-xl font-semibold mb-4 text-secondary">
      Waktu tersisa: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
    </p>
  );
};

export default Timer;