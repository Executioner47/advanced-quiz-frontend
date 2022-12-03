import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "@mui/material";
import bg from "./bg.png";

const CreateQuiz = () => {
  let [quizTitle, setQuizTitle] = useState("");
  let [quizDesc, setQuizDesc] = useState("");
  let [quizPassword, setQuizPassword] = useState("");
  let [questions, setQuestions] = useState([
    {
      question: "",
      answerOptions: [
        { answerText: "", isCorrect: false },
        { answerText: "", isCorrect: false },
      ],
    },
  ]);
  let [showAlert, setShowAlert] = useState(false);
  let navigate = useNavigate();
  let handleSubmit = async (e) => {
    e.preventDefault();
    
    let quiz = {
      quizTitle,
      quizDesc,
      quizPassword,
      questions,
    };
    console.log(quiz)
    setShowAlert(true);
    let response = await fetch(process.env.REACT_APP_API_URL + "/quiz", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quiz),
    });
    if (response.status == 403) {
      let error = await response.json();
      console.log(error.message);
    } else if (response.err) {
      console.log("error");
    } else {
      navigate("/");
    }
  };
  let handleInputChange = (e, index) => {
    let { name, value } = e.target;
    let list = [...questions];
    questions[index][name] = value;
    setQuestions(list);
  };
  let handleAnswerInputChange = (e, questionIndex, answerIndex) => {
    let { value } = e.target;
    let newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions[answerIndex].answerText = value;
    setQuestions(newQuestions);
  };
  let handleRadioButtonChange = (e, questionIndex, answerIndex) => {
    let newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions.forEach((answer) => {
      answer.isCorrect = false;
    });
    newQuestions[questionIndex].answerOptions[answerIndex].isCorrect = true;
    setQuestions(newQuestions);
  };
  let handleAddClick = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answerOptions: [
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
      },
    ]);
  };
  let handleDeleteQuestion = (index) => {
    let list = [...questions];
    list.splice(index, 1);
    setQuestions(list);
  };
  let handleDeleteAnswer = (questionIndex, answerIndex) => {
    let list = [...questions];
    list[questionIndex].answerOptions.splice(answerIndex, 1);
    setQuestions(list);
  };
  let handleAddAnswer = (e, questionIndex) => {
    let newQuestions = [...questions];
    let length = newQuestions[questionIndex].answerOptions.length + 1;
    if (length <= 4) {
      newQuestions[questionIndex].answerOptions.push({
        answerText: "",
        isCorrect: false,
      });
      setQuestions(newQuestions);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="container">
        {showAlert && (
          <Alert severity="success" className="alert">
            Quiz Created Successfuly
          </Alert>
        )}
        <div className="content">
          <div className="left">
            <div className="formFields">
              <label htmlFor="quizTitle" className="form-label">
                Quiz Name:
              </label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your QuizName"
                className="form-control"
                id="quizTitle"
                name="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
            </div>
            <div className="formFields">
              <label htmlFor="quizDesc" className="form-label">
                Quiz Description:
              </label>
              <textarea
                id="quizDesc"
                name="quizDesc"
                className="form-control"
                value={quizDesc}
                onChange={(e) => setQuizDesc(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="formFields">
              <label htmlFor="quizPassword" className="form-label">
                Quiz Password:
              </label>
              <input
                type="password"
                autoComplete="off"
                placeholder="Enter your Password"
                className="form-control"
                id="quizPassword"
                name="quizPassword"
                value={quizPassword}
                onChange={(e) => setQuizPassword(e.target.value)}
              />
            </div>
            <button className="btn">Submit</button>
          </div>
          <div className="right">
            <div className="formFields">
              {questions.map((question, i) => {
                return (
                  <div className="box" key={i}>
                    <div className="question">
                      <label htmlFor="question" className="form-label">
                        Question{i + 1}:
                      </label>
                      <input
                        name="question"
                        placeholder="Enter Question"
                        value={question.question}
                        onChange={(e) => handleInputChange(e, i)}
                        required
                      />
                    </div>
                    <div className="answersContainer">
                      <h2>Answers:</h2>
                      {question.answerOptions.map((answer, j) => {
                        return (
                          <div className="answerInput" key={j}>
                            <input
                              type="radio"
                              onChange={(e) => handleRadioButtonChange(e, i, j)}
                              checked={answer.isCorrect}
                              id={"answer" + j}
                              name={"answer" + i}
                              value={j}
                              required
                            />
                            <input
                              type="text"
                              name="answerOptions"
                              placeholder="Enter Answer"
                              value={answer.answerText}
                              onChange={(e) => handleAnswerInputChange(e, i, j)}
                              required
                            />
                            {question.answerOptions.length > 2 && (
                              <button
                                className="btn"
                                onClick={() => handleDeleteAnswer(i, j)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="btns">
                      <button
                        className="btn"
                        onClick={(e) => handleAddAnswer(e, i)}
                      >
                        <span className="addAnswer">Add New Answer</span>
                        <FontAwesomeIcon icon={faPlus} className="plusIcon" />
                      </button>
                      {questions.length !== 1 && (
                        <button
                          className="btn"
                          onClick={() => handleDeleteQuestion(i)}
                        >
                          Remove
                        </button>
                      )}
                      {questions.length - 1 === i && (
                        <button onClick={handleAddClick} className="btn">
                          Add New Question
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateQuiz;
