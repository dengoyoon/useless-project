import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Level = "EASY" | "NORMAL" | "HARD";
type TimerState = "INIT" | "RUN" | "STOP";

const useTimer = () => {
  const [time, setTime] = useState(0);
  const prevTime = useRef<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>("INIT");
  const requestId = useRef(0);

  const animate = (currentTime: DOMHighResTimeStamp) => {
    if (prevTime.current === null) {
      prevTime.current = currentTime;
    }
    setTime((currentTime - prevTime.current) / 1000);
    requestId.current = requestAnimationFrame(animate);
  };
  const start = () => {
    setTimerState("RUN");
    requestId.current = requestAnimationFrame(animate);
  };
  const stop = () => {
    setTimerState("STOP");
    cancelAnimationFrame(requestId.current);
  };
  const reset = () => {
    prevTime.current = null;
    setTimerState("INIT");
    setTime(0);
  };
  useEffect(() => {
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  return { time, timerState, start, stop, reset };
};

const useGame = () => {
  const [level, setLevel] = useState<Level>("EASY");
  const goalTime = useMemo(() => Math.floor(Math.random() * 5) + 1, []); // 1 ~ 5의 난수
  const decimalPoint = {
    EASY: 2,
    NORMAL: 4,
    HARD: 8,
  }[level];

  const roundDownDecimalPoint = useCallback(
    (time: number) => {
      const x = Math.pow(10, decimalPoint);
      return Math.trunc(time * x) / x;
    },
    [decimalPoint]
  );

  const displayTime = (time: number) => {
    return roundDownDecimalPoint(time).toFixed(decimalPoint);
  };

  const calculateMistake = (time: number) => {
    return goalTime - roundDownDecimalPoint(time);
  };

  return {
    level,
    goalTime,
    setLevel,
    displayTime,
    calculateMistake,
  };
};

function App() {
  const { time, timerState, start, stop, reset } = useTimer();
  const { level, goalTime, setLevel, displayTime, calculateMistake } =
    useGame();

  const mistakeTime = calculateMistake(time);
  const failMessage = [
    "당신은 실패자 입니다.",
    "당신은 사람이 맞습니까?",
    "당신은 재능이 없습니다.",
  ];
  return (
    <>
      <div>난이도 선택 : {level}</div>
      <div>
        <button onClick={() => setLevel("EASY")}>EASY</button>
        <button onClick={() => setLevel("NORMAL")}>NORMAL</button>
        <button onClick={() => setLevel("HARD")}>HARD</button>
      </div>
      <div>당신의 목표는 {goalTime}초 입니다</div>
      <div>{displayTime(time)}</div>
      <div>
        {timerState === "INIT" && <button onClick={() => start()}>시작</button>}
        {timerState === "RUN" && (
          <button onClick={() => stop()}>지금이야!</button>
        )}
        {timerState === "STOP" && (
          <div>
            <button onClick={() => reset()}>다시?</button>
            {mistakeTime === 0 && <div>최고에요 ^^</div>}
            {mistakeTime < 0 && (
              <div>
                당신은 {displayTime(Math.abs(mistakeTime))}초 느렸습니다.
              </div>
            )}
            {mistakeTime > 0 && (
              <div>
                당신은 {displayTime(Math.abs(mistakeTime))}초 빨랐습니다.
              </div>
            )}
            {mistakeTime !== 0 && (
              <div>
                {failMessage[Math.floor(Math.random() * failMessage.length)]}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
