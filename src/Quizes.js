import cardBg from "./cardBg.svg";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTrash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import noData from "./noData.svg";
import Alert from "./Alert";

let Quizes = ({ quizes, setQuizes }) => {
  let [isLoading, setIsLoading] = useState(false);
  let [showAlert, setShowAlert] = useState(false);
  let [pass,setPass] = useState("")
  let navigate = useNavigate();
  let handleDelete = (id) => {
    setIsLoading(true);
    fetch(process.env.REACT_APP_API_URL + "/quiz/" + id, {
      method: "DELETE",
    }).then(() => {
      setQuizes(quizes.filter((quiz) => quiz._id !== id));
      console.log("Quiz Deleted");
      setIsLoading(false);
      setShowAlert(true);
    });
  };
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (quizes.length === 0) {
    return (
      <>
      {showAlert && <Alert alertText={"Quiz Deleted Successfully"} alertType={"success"} />}
        <div className="noQuizes">
          <img src={noData} alt="" />
          <h2>No Quizes To Show</h2>
          <Link to={"/createQuiz"}>Create Your Own Quiz</Link>
        </div>
      </>
    );
  }
  let startQuizHandler = (quizPassword,id) =>{
    if(pass === quizPassword){
      navigate("/quiz/"+id);
    }
  }
  return (
    <>
      {showAlert && <Alert alertText={"Quiz Deleted Successfully"} alertType={"success"} />}
      <div className="quizes">
        {quizes.map((item) => {
          let { quizTitle, quizDesc, _id, quizPassword,quizTime } = item;
          return (
            <div className="quiz" style={{ maxWidth: "370px" }} key={_id}>
              <div className="cardImage">
                <img src={cardBg} alt="cardBackground" />
                {quizPassword && <FontAwesomeIcon icon={faLock} className="lock" />}
                {quizTime && <div className="time">{quizTime} {quizTime > 1 ? 'Minutes':'Minute '}</div>}
              </div>
              <div className="lock"></div>
              <div className="cardBody">
                <div className="quizTitle">{quizTitle}</div>
                <div className="quizDesc">{quizDesc}</div>
              </div>
              <div className="cardFooter">
                <div className="delete" onClick={() => handleDelete(_id)}>
                  <FontAwesomeIcon icon={faTrash} className="trash" />
                </div>
                <Link to={'/quiz/'+_id}>
                  <FontAwesomeIcon icon={faPlay} className="play" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Quizes;
