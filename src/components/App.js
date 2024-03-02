import { useEffect } from "react";
import Header from "./Header";
import Main from "./main";
import Loader from "./Loader";
import Error from "./Error";
import { useReducer } from "react";
import StartScreen from "./StartScreen";
import Questions from "./Questions";

const initialstate = {
  questions: [],
  // "loading",active,error,ready,finished
  status: "loading",
  // state for accessing the questions from questions object
  index: 0,
  // state for storing or getting the clicked option as answer
  answer: null,
  // state for storing the data of the points if the answer was correct
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "datafailed":
      return {
        ...state,
        status: "error",
      };
    case "newAnswer":
      // to get to the current question number from state "questions"
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          // conditionally setting the value of points state
          action.payload === question.correctOption
            ? state.points === question.points
            : state.points,
      };
    case "start":
      return { ...state, status: "active" };
    default:
      throw new Error("Unkown action");
  }
}

export default function App() {
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  // destructuring state object down
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialstate
  );

  const numQuestions = questions.length;
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Questions
            question={questions[index]}
            answer={answer}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
