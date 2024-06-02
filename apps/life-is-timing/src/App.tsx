import { useGame, useTimer, useSpaceBarClick } from "hooks";

function App() {
  const { time, timerState, clickTimer } = useTimer();
  const { level, goalTime, setLevel, displayTime, calculateMistake } =
    useGame();

  const mistakeTime = calculateMistake(time);
  const failMessage = [
    "당신은 실패자 입니다.",
    "당신은 사람이 맞습니까?",
    "당신은 재능이 없습니다.",
    "당신은 답이 없습니다.",
  ];

  useSpaceBarClick(() => {
    clickTimer.next().value();
  });

  return (
    <div>
      <div>난이도 선택 : {level}</div>
      <div>
        <button
          disabled={timerState !== "INIT"}
          onClick={() => setLevel("EASY")}
        >
          EASY
        </button>
        <button
          disabled={timerState !== "INIT"}
          onClick={() => setLevel("NORMAL")}
        >
          NORMAL
        </button>
        <button
          disabled={timerState !== "INIT"}
          onClick={() => setLevel("HARD")}
        >
          HARD
        </button>
      </div>
      <div>당신의 목표는 {goalTime}초 입니다</div>
      <div>{displayTime(time)}</div>
      <button
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
        onClick={() => {
          clickTimer.next().value();
        }}
      >
        {
          {
            INIT: "시작",
            RUN: "지금이야!",
            STOP: "다시?",
          }[timerState]
        }
      </button>
      {timerState === "STOP" && (
        <div>
          {mistakeTime === 0 && <div>최고에요 ^^</div>}
          {mistakeTime < 0 && (
            <div>당신은 {displayTime(Math.abs(mistakeTime))}초 느렸습니다.</div>
          )}
          {mistakeTime > 0 && (
            <div>당신은 {displayTime(Math.abs(mistakeTime))}초 빨랐습니다.</div>
          )}
          {mistakeTime !== 0 && (
            <div>
              {failMessage[Math.floor(Math.random() * failMessage.length)]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
