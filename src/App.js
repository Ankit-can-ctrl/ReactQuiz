import { useEffect } from "react";
import Header from "./Header";
import Main from "./main";
import Loader from "./Loader";
import Error from "./Error";
import { useReducer } from "react";
import Startscreen from "./Startscreen";

const initialstate = {
  questions: [],
  // "loading",active,error,ready,finished
  status: "loading",
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
  const [{ questions, status }, dispatch] = useReducer(reducer, initialstate);

  const numQuestions = questions.length;
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && <Startscreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}
