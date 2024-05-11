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

function App() {
  const { time, start, stop, reset } = useTimer();
  return (
    <>
      <div>{time}</div>
      <div>
        <button onClick={() => start()}>Start</button>
        <button onClick={() => stop()}>Stop</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </>
  );
}

export default App;
