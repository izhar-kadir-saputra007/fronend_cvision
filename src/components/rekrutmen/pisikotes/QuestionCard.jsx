const QuestionCard = ({
  question = { pertanyaan: "", options: [] },
  questions = [],
  currentQuestionIndex,
  answers,
  handleAnswerChange,
  isFinished,
  hasSubmitted,
  handleBack,
  handleNext,
}) => {
  return (
    <div className="card test mb-6 border border-secondary rounded-lg p-10">
      <p className="font-semibold text-color2">
        <span className="text-color1">Soal </span>
        <span className="text-color1"> {currentQuestionIndex + 1}</span> :{" "}
        {question.pertanyaan}
      </p>
      <div className="flex flex-col space-y-2 mt-2">
        {question.options.map((option, optionIndex) => (
          <label key={optionIndex} className="inline-flex items-center">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={option.answer}
              checked={
                answers[currentQuestionIndex]?.answer === option.answer
              }
              onChange={() =>
                handleAnswerChange(currentQuestionIndex, {
                  answer: option.answer,
                  score: option.score,
                })
              }
              className="form-radio text-indigo-600"
              disabled={isFinished || hasSubmitted}
            />
            <span className="ml-2 text-secondary">{option.answer}</span>
          </label>
        ))}
      </div>
      <div className="mt-12">
        <div className="flex justify-between">
          <div className="flex justify-between gap-3">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="bg-secondary text-white p-2 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="bg-secondary text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;