export const binaryToYesNo = (value) => (value === 1 ? "Yes" : "No");
export const yesNoToBinary = (value) => (value === "Yes" ? 1 : 0);
export const countOccurrences = (arr, value) =>
  arr.filter((item) => item === value).length;

export const getActivityQuestionText = (questionId) => {
  const activityQuestionMap = {
    A: "If on a two-wheeler, did the rider and pillion wear helmets?",
    B: "If in a car, did the driver and passengers wear seat belts?",
    C: "Did the rider/driver excessively honk?",
    D: "Did the rider/driver follow traffic signals?",
    E: "During a red signal, did the rider/driver stop within the stop line?",
    F: "Did the rider/driver use a cell phone while riding/driving?",
    G: "Did the rider/driver frequently change lanes?",
    H: "Did the rider/driver drive in a no-entry?",
    I: "Did they give way to pedestrians?",
    J: "If in an auto, did they overload the auto?",
    K: "If you were on a two-wheeler, did you triple ride?",
    L: "Did your rider/driver have a driving license and insurance?",
  };
  return activityQuestionMap[questionId] || questionId;
};

export const getQuestionText = (questionId) => {
  const questionMap = {
    q1: "Was this learning initiative helpful?",
    q2: "Did you find the change in the driving skills of the driver?",
    q3: "Enjoyed the rides?",
    q4: "Felt more safe & comfortable?",
    q5: "Learnt road safety rules?",
    q6: "Good Family learning on road safety?",
  };
  return questionMap[questionId] || questionId;
};

export const getParentQuestionText = (questionId) => {
  const parentQuestionMap = {
    q1: "Did your child learn about road safety rules?",
    q2: "Were you satisfied in ensuring safe drive for you and your family?",
  };
  return parentQuestionMap[questionId] || questionId;
};
