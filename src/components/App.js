import { useEffect } from "react";
import Header from "./Header";
import Main from "./main";
import Loader from "./Loader";
import Error from "./Error";
import { useReducer } from "react";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

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
  highscore: 0,
  secondsRemaining: null,
};
const SECS_PER_QUES = 30;
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
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUES,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialstate, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unkown action");
  }
}

export default function App() {
  useEffect(() => {
    const allQuestions = [
      {
        question: "Which is the most popular JavaScript framework?",
        options: ["Angular", "React", "Svelte", "Vue"],
        correctOption: 1,
        points: 10,
      },
      {
        question: "Which company invented React?",
        options: ["Google", "Apple", "Netflix", "Facebook"],
        correctOption: 3,
        points: 10,
      },
      {
        question: "What's the fundamental building block of React apps?",
        options: ["Components", "Blocks", "Elements", "Effects"],
        correctOption: 0,
        points: 10,
      },
      {
        question:
          "What's the name of the syntax we use to describe the UI in React components?",
        options: ["FBJ", "Babel", "JSX", "ES2015"],
        correctOption: 2,
        points: 10,
      },
      {
        question: "How does data flow naturally in React apps?",
        options: [
          "From parents to children",
          "From children to parents",
          "Both ways",
          "The developers decides",
        ],
        correctOption: 0,
        points: 10,
      },
      {
        question: "How to pass data into a child component?",
        options: ["State", "Props", "PropTypes", "Parameters"],
        correctOption: 1,
        points: 10,
      },
      {
        question: "When to use derived state?",
        options: [
          "Whenever the state should not trigger a re-render",
          "Whenever the state can be synchronized with an effect",
          "Whenever the state should be accessible to all components",
          "Whenever the state can be computed from another state variable",
        ],
        correctOption: 3,
        points: 30,
      },
      {
        question: "What triggers a UI re-render in React?",
        options: [
          "Running an effect",
          "Passing props",
          "Updating state",
          "Adding event listeners to DOM elements",
        ],
        correctOption: 2,
        points: 20,
      },
      {
        question: 'When do we directly "touch" the DOM in React?',
        options: [
          "When we need to listen to an event",
          "When we need to change the UI",
          "When we need to add styles",
          "Almost never",
        ],
        correctOption: 3,
        points: 20,
      },
      {
        question: "In what situation do we use a callback to update state?",
        options: [
          "When updating the state will be slow",
          "When the updated state is very data-intensive",
          "When the state update should happen faster",
          "When the new state depends on the previous state",
        ],
        correctOption: 3,
        points: 30,
      },
      {
        question:
          "If we pass a function to useState, when will that function be called?",
        options: [
          "On each re-render",
          "Each time we update the state",
          "Only on the initial render",
          "The first time we update the state",
        ],
        correctOption: 2,
        points: 30,
      },
      {
        question:
          "Which hook to use for an API request on the component's initial render?",
        options: ["useState", "useEffect", "useRef", "useReducer"],
        correctOption: 1,
        points: 10,
      },
      {
        question:
          "Which variables should go into the useEffect dependency array?",
        options: [
          "Usually none",
          "All our state variables",
          "All state and props referenced in the effect",
          "All variables needed for clean up",
        ],
        correctOption: 2,
        points: 30,
      },
      {
        question: "An effect will always run on the initial render.",
        options: [
          "True",
          "It depends on the dependency array",
          "False",
          "In depends on the code in the effect",
        ],
        correctOption: 0,
        points: 30,
      },
      {
        question:
          "When will an effect run if it doesn't have a dependency array?",
        options: [
          "Only when the component mounts",
          "Only when the component unmounts",
          "The first time the component re-renders",
          "Each time the component is re-rendered",
        ],
        correctOption: 3,
        points: 20,
      },
    ];
    dispatch({ type: "dataReceived", payload: allQuestions });
  }, []);

  // destructuring state object down
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialstate);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

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
          <>
            <Progress
              points={points}
              index={index}
              numQuestions={numQuestions}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
