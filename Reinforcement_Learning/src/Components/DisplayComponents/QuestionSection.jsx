import QuestionItem from "./QuestionItem";

function QuestionSection({
  title,
  questions,
  handleChange,
  getQuestionText,
  binaryToYesNo,
}) {
  const color = title === "By Child" ? "yellow" : "red";
  return (
    <div className={`bg-${color}-50 p-6 rounded-lg`}>
      <h2 className={`text-xl font-semibold mb-4 text-${color}-700`}>
        {title}
      </h2>
      <div className="space-y-2">
        {questions.map((value, index) => (
          <QuestionItem
            key={`${title}-${index}`}
            questionText={getQuestionText(`q${index + 1}`)}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            binaryToYesNo={binaryToYesNo}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionSection;
