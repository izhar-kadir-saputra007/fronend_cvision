const QuestionNavigation = ({
  questions,
  currentQuestionIndex,
  answers,
  handleQuestionNavigation,
  handleSubmit,
  hasSubmitted
}) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 border border-color4 p-4">
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionNavigation(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-color5 ${
              currentQuestionIndex === index
                ? "bg-secondary"
                : answers[index] && answers[index].answer !== ""
                ? "bg-hijau"
                : "bg-color4"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          className="items-center bg-secondary px-2 py-2 text-lg rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-secondary hover:border-secondary transition-all shadow-custom max-w-fit hover:shadow-custom2"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default QuestionNavigation;