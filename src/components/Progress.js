function Progress({ index, numQuestions, points, maxPoints, answer }) {
  return (
    <header className="progress">
      {/* in below value of progress condition is used if true it will give 0 else 1 trick to increase the index */}
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Questions <strong>{index + 1}</strong>/{numQuestions}{" "}
      </p>
      <p>
        Points <strong>{points}</strong>/{maxPoints}
      </p>
    </header>
  );
}

export default Progress;
