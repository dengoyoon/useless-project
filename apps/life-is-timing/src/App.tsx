import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Level = "EASY" | "NORMAL" | "HARD";
type TimerState = "INIT" | "RUN" | "STOP";

function* arrayLoopGenerator(arr: Array<() => void>): Generator<() => void> {
  while (true) {
    for (const a of arr) {
      yield a;
    }
  }
}

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

  const clickTimer = useMemo(
    () => arrayLoopGenerator([start, stop, reset]),
    []
  );

  useEffect(() => {
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  return { time, timerState, clickTimer };
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

  useEffect(() => {
    const handleSpaceBarClick = (event: KeyboardEvent) => {
      if (event.key === " ") {
        clickTimer.next().value();
      }
    };
    window.addEventListener("keydown", handleSpaceBarClick);
    return () => {
      window.removeEventListener("keydown", handleSpaceBarClick);
    };
  }, []);

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
