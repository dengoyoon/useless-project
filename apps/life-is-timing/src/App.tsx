import { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const [time, setTime] = useState(0);
  const requestId = useRef(0);
  const animate = () => {
    setTime((prev) => prev + 1);
    requestId.current = requestAnimationFrame(animate);
  };
  const start = () => {
    requestId.current = requestAnimationFrame(animate);
  };
  const stop = () => {
    cancelAnimationFrame(requestId.current);
  };
  const reset = () => {
    setTime(0);
  };
  useEffect(() => {
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  return { time, start, stop, reset };
};

const useToggle = (initState: boolean = false) => {
  const [on, setOn] = useState(initState);
  const toggle = () => setOn((prev) => !prev);
  return { on, toggle };
};

function App() {
  const { time, start, stop, reset } = useTimer();
  const { on, toggle } = useToggle();
  return (
    <>
      <div>{time}</div>
      <div onClick={() => toggle()}>
        {on ? (
          <div>
            <button onClick={() => stop()}>Stop</button>
            <button onClick={() => reset()}>Reset</button>
          </div>
        ) : (
          <button onClick={() => start()}>Start</button>
        )}
      </div>
    </>
  );
}

export default App;
