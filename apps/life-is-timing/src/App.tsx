import { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const [time, setTime] = useState(0);
  const prevTime = useRef<number | null>(null);
  const [timerState, setTimerState] = useState("INIT");
  const requestId = useRef(0);

  const animate = (currentTime: DOMHighResTimeStamp) => {
    if (prevTime.current === null) {
      prevTime.current = currentTime;
    }
    setTime(currentTime - prevTime.current);
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

function App() {
  const { time, timerState, start, stop, reset } = useTimer();
  return (
    <>
      <div>{(time / 1000).toFixed(4)}</div>
      <div>
        {timerState === "INIT" && (
          <button onClick={() => start()}>Start</button>
        )}
        {timerState === "RUN" && <button onClick={() => stop()}>Stop</button>}
        {timerState === "STOP" && (
          <button onClick={() => reset()}>Reset</button>
        )}
      </div>
    </>
  );
}

export default App;
